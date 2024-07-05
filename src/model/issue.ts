import { isNil } from "@common/feature";
import { VERSION } from "@src/common/variable";
import { Logger } from "./logger";
import { Util } from "./issue.util";
import { TaskTrace } from "./task.trace";

type Predicate<R = any> = (...args: any) => R;

export class Issue {
  /* 버전 체크 */
  static get version() {
    return VERSION;
  }

  static get logger() {
    return new Logger();
  }

  static util = new Util();

  /* 이슈 생성 */
  static task(name: string) {
    const issue = new Issue(name);
    return issue;
  }

  /* 이슈 해결 메서드 */
  static solve(issue: Issue) {
    const start = Date.now();
    // console.log("solving:", issue.#build);
    // console.log("solving name:", issue.name);
    let result: any = null;
    let errors: Error | null = null;

    issue.taskTrace.write({
      protocol: "SOLVING",
      detail: "solve issues",
    });
    for (const task of issue.#build) {
      let useArgs = null;
      // console.log(issue.#useArgs, task);

      if (!Array.isArray(issue.#useArgs)) continue;
      // if (issue.#useArgs.length <= 0) continue;

      useArgs = [...issue.#useArgs];
      issue.#useArgs = [];
      if (!isNil(useArgs)) {
        if (task instanceof TryIssue) {
          // try
          try {
            // console.log("nil task", task.do);
            result = task.do(...useArgs);
          } catch (error: any) {
            // console.log("error", error);
            issue.#catch(error);
            if (issue.throw) {
              throw error;
            }
            errors = error;
          }
        } else if (task instanceof Function) {
          result = task(...useArgs);

          if (!isNil(result)) {
            if (Array.isArray(result)) {
              issue.#useArgs.push(...result);
            } else {
              issue.#useArgs.push(result);
            }
          }
        }
      }
    }
    if (errors) result = null;

    const end = Date.now();

    issue.taskTrace.write({
      protocol: "TIMESTAMP",
      detail: {
        start,
        end,
        gap: end - start,
      },
    });

    return {
      result,
      error: errors,
    };
  }

  static solveAsync(issue: Issue) {
    let result: any = null;
    let errors: Error | null = null;

    return new Promise(async (resolve, reject) => {
      for (const task of issue.#build) {
        let useArgs = null;

        if (!Array.isArray(issue.#useArgs)) continue;
        // if (issue.#useArgs.length <= 0) continue;

        useArgs = [...issue.#useArgs];
        issue.#useArgs = [];

        // if (isNil(useArgs)) continue;

        if (task instanceof TryIssue) {
          try {
            result = task.do(...useArgs);
          } catch (error: any) {
            issue.#catch(error);
            if (issue.throw) {
              reject(error);
              break;
            }
            errors = error;
          }
          continue;
        }
        if (task instanceof Function) {
          result = await task(...useArgs);
          if (!isNil(result)) {
            if (Array.isArray(result)) {
              issue.#useArgs.push(...result);
            } else {
              issue.#useArgs.push(result);
            }
          }
          continue;
        }
      }

      if (errors) result = null;
      resolve({
        result,
        error: errors,
      });
    });
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
  use<T>(...args: T[]) {
    // copy array
    this.#useArgs = [...args];
    this.taskTrace.write({
      protocol: "USING",
      detail: args.length === 0 ? "not use arguments" : "use arguments",
    });
  }

  /* 빌드 처리 */
  pipe<T extends Predicate<R>, R = ReturnType<T>>(predicate: T): void {
    this.#build.push(predicate);
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

  catch(predicate: Predicate) {
    Object.assign(this, { "#catch": predicate });
    this.#trycatch.try = true;
  }

  #catch(error?: any) {
    this.logger.log("catch error:", error.message);
    this.taskTrace.write({
      protocol: "ERROR",
      detail: "pipe work fail:" + error,
    });
  }

  finally(predicate: Predicate) {
    this.#build.push(predicate);
  }
}

export class TryIssue extends Issue {
  do: Predicate;

  constructor(predicate: Predicate) {
    super("try");
    this.do = predicate;
  }
}
