import { isNil } from "@common/feature";
import { VERSION } from "@src/common/variable";
import { Logger } from "./logger";
import { Util } from "./issue.util";
import { LogLine, TaskTrace } from "./task.trace";

export type Predicate<K = any, R = any> = (issue: Issue, args: K) => R;
export type Solved<T = any> = {
  name: string;
  result: T | null;
  error: Error;
  trace: LogLine[];
};

export class Issue {
  static #mode: Mode = "development";

  static set mode(mode: Mode) {
    Issue.logger.log("set mode");
    Issue.#mode = mode;
  }

  static get mode() {
    return this.#mode;
  }

  /* 버전 체크 */
  static get version() {
    return VERSION;
  }

  static get logger() {
    const logger = new Logger();
    return logger;
  }

  static util = new Util();

  /* 이슈 생성 */
  static task(name: string) {
    const issue = new Issue(name);
    return issue;
  }

  /* 이슈 해결 메서드 */
  static solve<T = any>(issue: Issue): Solved<T> {
    const copyIssue = issue.deepcopy();
    const start = Date.now();
    let result: T | null = null;
    let errors: Error = {
      message: "",
      stack: "",
      cause: "",
      name: "",
    };

    copyIssue.taskTrace.write({
      protocol: "SOLVING",
      detail: "solve issues",
    });

    for (const task of copyIssue.#build) {
      let useArgs = null;

      if (!Array.isArray(copyIssue.#useArgs)) continue;

      useArgs = [...copyIssue.#useArgs];
      copyIssue.#useArgs = [];
      if (task instanceof Issue) {
        try {
          result = task.do(issue, useArgs);
          copyIssue.taskTrace.write({
            protocol: "DOING",
            detail: [result],
          });
        } catch (error: any) {
          copyIssue.#catch(error);
          if (copyIssue.throw) {
            throw error;
          }
          errors = error;
        }
      } else if (task instanceof TryIssue) {
        try {
          result = task.do(issue, useArgs);
          copyIssue.taskTrace.write({
            protocol: "DOING",
            detail: [result],
          });
        } catch (error: any) {
          copyIssue.#catch(error);
          if (copyIssue.throw) {
            throw error;
          }
          errors = error;
        }
      } else if (task instanceof Function) {
        try {
          result = task(issue, useArgs);
        } catch (error: any) {
          copyIssue.#catch(error);
          if (copyIssue.throw) {
            throw error;
          }
          errors = error;
        }
        copyIssue.taskTrace.write({
          protocol: "DOING",
          detail: [result],
        });
        if (!isNil(result)) {
          if (Array.isArray(result)) {
            copyIssue.#useArgs.push(...result);
          } else {
            copyIssue.#useArgs.push(result);
          }
        }
      }
    }

    if (errors.stack) result = null;

    const end = Date.now();

    copyIssue.taskTrace.write({
      protocol: "TIMESTAMP",
      detail: {
        start,
        end,
        gap: end - start,
      },
    });

    return {
      name: copyIssue.name,
      result,
      error: errors,
      trace: copyIssue.taskTrace.show(),
    };
  }

  static solveAsync(issue: Issue): Promise<Solved> {
    const copyIssue = new Issue(issue.name);
    Object.assign(copyIssue, issue);
    let result: any = null;
    let errors: Error = {
      message: "",
      stack: "",
      cause: "",
      name: "",
    };

    return new Promise(async (resolve, reject) => {
      for (const task of copyIssue.#build) {
        let useArgs = null;

        if (!Array.isArray(copyIssue.#useArgs)) continue;

        useArgs = [...copyIssue.#useArgs];
        copyIssue.#useArgs = [];

        if (task instanceof Issue) {
          try {
            result = task.do(issue, useArgs);
            copyIssue.taskTrace.write({
              protocol: "DOING",
              detail: [result],
            });
          } catch (error: any) {
            copyIssue.#catch(error);
            if (copyIssue.throw) {
              throw error;
            }
            errors = error;
          }
        } else if (task instanceof TryIssue) {
          try {
            result = await task.do(issue, useArgs);
            copyIssue.taskTrace.write({
              protocol: "DOING",
              detail: [result],
            });
          } catch (error: any) {
            copyIssue.#catch(error);
            if (copyIssue.throw) {
              reject(error);
              break;
            }
            errors = error;
          }
          continue;
        }
        if (task instanceof Function) {
          try {
            result = await task(issue, useArgs);
          } catch (error: any) {
            copyIssue.#catch(error);
            if (copyIssue.throw) {
              reject(error);
              break;
            }
            errors = error;
          }
          copyIssue.taskTrace.write({
            protocol: "DOING",
            detail: [result],
          });
          if (!isNil(result)) {
            if (Array.isArray(result)) {
              copyIssue.#useArgs.push(...result);
            } else {
              copyIssue.#useArgs.push(result);
            }
          }
          continue;
        }
      }

      if (errors.stack) result = null;
      resolve({
        name: copyIssue.name,
        result,
        error: errors,
        trace: copyIssue.taskTrace.show(),
      });
    });
  }

  deepcopy() {
    const newIssue = new Issue(this.name);
    newIssue.use([...this.#useArgs]);
    newIssue.catch(this.copyCatch());
    newIssue.#trycatch = { ...this.#trycatch };
    newIssue.#build = [...this.#build];
    return newIssue;
  }

  get size() {
    return this.#build.length;
  }

  /* 이슈 멤버 프로퍼티 */
  throw: boolean = false;
  name!: string;
  #useArgs: any[] = [];
  #build: (TryIssue | Predicate)[] = [];
  #trycatch = {
    try: false,
    catch: false,
    finally: false,
  };

  logger: Logger;
  taskTrace: TaskTrace;

  constructor();
  constructor(name: string);
  constructor(name?: string) {
    this.logger = new Logger(this);
    this.taskTrace = new TaskTrace();
    if (name) {
      this.name = name;
    }
  }

  /* 사용 인자 등록 */
  use<T extends [...any]>(args: T) {
    const argument = args instanceof Array ? args : [args];
    // copy array
    this.#useArgs = [...argument];
    this.taskTrace.write({
      protocol: "USING",
      detail: args.length === 0 ? "not use arguments" : "use arguments",
    });
  }

  /* 빌드 처리 */
  pipe<K extends any, R extends any>(predicate: Predicate<K, R>): void {
    this.#build.push(predicate);
    if (Issue.util.hasIn(predicate, "parent")) predicate.parent = this;
    this.taskTrace.write({
      protocol: "PASS",
      detail: "pipe insert",
    });
  }

  try(predicate: Predicate) {
    const tryIssue = new TryIssue(predicate);
    this.#build.push(tryIssue);
    this.#trycatch.try = true;
  }

  protected copyCatch() {
    return this.#catch;
  }

  catch(predicate: Predicate) {
    Object.assign(this, { "#catch": predicate });
    this.#trycatch.catch = true;
  }

  #catch(error?: any) {
    this.logger.log("catch error:", error.message);
    this.taskTrace.write({
      protocol: "ERROR",
      detail: "pipe work fail: " + error,
    });
  }

  finally(predicate: Predicate) {
    this.#build.push(predicate);
    this.#trycatch.finally = true;
  }
}

export class TryIssue extends Issue {
  do: Predicate;

  constructor(predicate: Predicate) {
    super("try");
    this.do = predicate;
  }
}
