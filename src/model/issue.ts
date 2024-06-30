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
    console.log("solving:", issue.build);
    console.log("solving name:", issue.name);
    let result = null;
    for (const task of issue.build) {
      let useArgs = null;

      if (Array.isArray(issue.useArgs) && issue.useArgs.length > 0) {
        useArgs = [...issue.useArgs];
        issue.useArgs = [];
      }

      if (!isNil(useArgs)) {
        result = task(...useArgs);
        if (result) {
          if (Array.isArray(result)) {
            issue.useArgs.push(...result);
          } else {
            issue.useArgs.push(result);
          }
        }
      }
    }
    return result;
  }

  /* 이슈 멤버 프로퍼티 */
  name!: string;
  useArgs: any[] = [];
  build: Predicate[] = [];

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
    this.useArgs = [...args];
  }

  /* 빌드 처리 */
  pipe<T extends Predicate<R>, R = ReturnType<T>>(predicate: T) {
    this.build.push(predicate);
  }
}
