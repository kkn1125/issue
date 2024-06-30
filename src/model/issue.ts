import { isNil } from "@common/feature";
import { VERSION } from "@src/common/variable";

type Predicate<R = any> = (...args: any) => R;

export class Issue {
  /* 버전 체크 */
  static get version() {
    return VERSION;
  }

  /* 이슈 생성 */
  static task(name: string) {
    const issue = new Issue(name);
    return issue;
  }

  /* 이슈 해결 메서드 */
  static solve(issue: Issue) {
    console.log("solving:", issue.#build);
    console.log("solving name:", issue.name);
    let result: any = null;
    let errors: Error | null = null;

    for (const task of issue.#build) {
      let useArgs = null;

      if (Array.isArray(issue.#useArgs) && issue.#useArgs.length > 0) {
        useArgs = [...issue.#useArgs];
        issue.#useArgs = [];
      }

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

          if (result) {
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
    return {
      result,
      error: errors,
    };
  }
  static solveAsync(issue: Issue) {
    console.log("solving:", issue.#build);
    console.log("solving name:", issue.name);
    let result: any = null;
    let errors: Error | null = null;

    return new Promise(async (resolve, reject) => {
      for (const task of issue.#build) {
        let useArgs = null;

        if (Array.isArray(issue.#useArgs) && issue.#useArgs.length > 0) {
          useArgs = [...issue.#useArgs];
          issue.#useArgs = [];
        }

        if (!isNil(useArgs)) {
          if (task instanceof TryIssue) {
            // try
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
          } else if (task instanceof Function) {
            result = await task(...useArgs);

            if (result) {
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
      resolve({
        result,
        error: errors,
      });
    });
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

  constructor();
  constructor(name: string);
  constructor(name?: string) {
    if (name) {
      this.name = name;
    }
  }

  /* 사용 인자 등록 */
  use<T>(...args: T[]) {
    // copy array
    this.#useArgs = [...args];
  }

  /* 빌드 처리 */
  pipe<T extends Predicate<R>, R = ReturnType<T>>(predicate: T): void {
    this.#build.push(predicate);
  }

  try(predicate: Predicate) {
    const tryIssue = new TryIssue(predicate);
    this.#build.push(tryIssue);
    this.#trycatch.try = true;
  }

  set catch(predicate: Predicate) {
    Object.assign(this, { "#catch": predicate });
    this.#trycatch.try = true;
  }

  #catch(error?: any) {
    console.log("catch error:", error.message);
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
