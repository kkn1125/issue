import { Issue } from "@model/issue";
import { describe, expect, it } from "vitest";
import pkg from "../../package.json";
import { IssueProtocol } from "@common/enum";

Issue.logger.debug("Issue Test version:", pkg.version);

describe("[Issue Test Case]", () => {
  describe("[Issue Basic]", () => {
    it("Issue creation", () => {
      const issueName = "My Issue";
      const issue = Issue.task(issueName);
      expect(issue.size).toStrictEqual(0);
      expect(issue.name).toStrictEqual(issueName);
    });

    it("Issue usage", () => {
      const issueName = "My Issue";
      const issue = Issue.task(issueName);
      const a = Issue.util.makeRandomValue({ max: 100 });
      const b = Issue.util.makeRandomValue({ max: 100 });
      const c = Issue.util.makeRandomValue({ max: 100 });
      issue.pipe(() => {
        return a + b;
      });
      issue.pipe((aa: number) => {
        issue.logger.debug("aa is:", aa, "c is:", c);
        return Issue.util.safeDiv(aa, c);
      });
      const report = Issue.solve(issue);
      issue.logger.debug("expected value is:", Issue.util.safeDiv(a + b, c));

      expect(report.error).toBeNull();
      expect(report.result).toStrictEqual(Issue.util.safeDiv(a + b, c));
      expect(issue.taskTrace.show().length).toStrictEqual(4);
      expect(issue.taskTrace.show()[0].code).toStrictEqual(
        IssueProtocol.PASS[0]
      );
      expect(issue.taskTrace.show()[2].code).toStrictEqual(
        IssueProtocol.SOLVING[0]
      );

      issue.logger.debug(issue.taskTrace.show());
    });
  });
});

// describe("Test", () => {
//   it("Test", () => {
//     console.log("[Test]: Test Case");
//     expect("1").toStrictEqual("1");
//   });
// });

// describe("Issue Class Test", () => {
//   it("Issue has static version method", () => {
//     console.log("[Issue Class Test]: Issue has static version method");
//     expect("version" in Issue).toBeTruthy();
//   });

//   it(`static version is ${pkg.version}`, () => {
//     console.log(`[Issue Class Test]: static version is ${pkg.version}`);
//     const currentVersion = pkg.version;
//     expect(Issue.version).toStrictEqual(currentVersion);
//   });
// });

// describe("Issue Class Test", () => {
//   let issue: Issue;

//   describe("Issue class Test: create new issue", () => {
//     it("new issue", () => {
//       issue = new Issue();

//       expect(issue).toBeDefined();
//     });
//   });
// });

// describe("Issue design Test", () => {
//   let issue: Issue;
//   describe("basic design", () => {
//     it("exception handle design: before use issue", () => {
//       const numA = Math.floor(Math.random() * 10);
//       const numB = Math.floor(Math.random() * 10);

//       function calcSum(a: number, b: number) {
//         return a + b;
//       }

//       function calcDiv(a: number, b: number) {
//         return Issue.util.safeDiv(a, b);
//       }

//       issue = new Issue();

//       expect(calcSum(numA, numB)).toStrictEqual(numA + numB);
//       expect(calcDiv(numA, numB)).toStrictEqual(Issue.util.safeDiv(numA, numB));
//     });

//     it("exception handle design: after use issue", () => {
//       const numA = Math.floor(Math.random() * 10);
//       const numB = Math.floor(Math.random() * 10);
//       const safeDivided = Issue.util.safeDiv(numA, numB);

//       function calcSum(a: number, b: number) {
//         return a + b;
//       }

//       function calcDiv(a: number, b: number) {
//         console.log("🔥 1", Issue.util.safeDiv(a, b));
//         return Issue.util.safeDiv(a, b);
//       }

//       function calcTest(a: number) {
//         console.log("🔥 2", a);
//         return [a - 5, 16];
//       }

//       function calcTest2(a: number, b: number) {
//         console.log("🔥 3", a, b);
//         console.log("check", a + b);
//         return a + b;
//       }

//       issue = Issue.task("solv calc Sum");
//       issue.use(numA, numB);
//       issue.pipe(calcSum);
//       expect(Issue.solve(issue).result).toStrictEqual(numA + numB);

//       issue = Issue.task("solv calc Div");
//       issue.use(numA, numB);
//       issue.pipe(calcDiv);
//       expect(Issue.solve(issue).result).toStrictEqual(safeDivided);

//       issue = Issue.task("solv calc Div");
//       issue.use(numA, numB);
//       issue.pipe(calcDiv);
//       issue.pipe(calcTest);
//       issue.pipe(calcTest2);
//       const result = safeDivided - 5 + 16;
//       expect(Issue.solve(issue).result).toStrictEqual(result);
//       console.log("is matched", result);

//       // expect(calcSum(numA, numB)).toStrictEqual(numA + numB);
//       // expect(calcDiv(numA, numB)).toStrictEqual(numA / numB);
//     });

//     it("test try", () => {
//       const numA = Math.floor(Math.random() * 10);
//       const numB = Math.floor(Math.random() * 10);

//       function calcSum(a: number, b: number) {
//         return a + b;
//       }

//       issue = Issue.task("solv calc Sum");
//       issue.throw = true;
//       issue.use(numA, numB);
//       issue.pipe(calcSum);
//       issue.try((...arg) => {
//         console.log("test", arg);
//         throw new Error("Test Error");
//       });
//       const result = () => Issue.solve(issue).error;
//       expect(result).toThrow(new Error("Test Error"));
//     });

//     it("should create an issue and solve it", () => {
//       // 이슈 생성
//       const issue = Issue.task("My Issue");

//       // 이슈 해결을 위한 작업 등록
//       issue.pipe(() => {
//         console.log("Task 1 completed");
//         return "Task 1 result";
//       });

//       issue.try(() => {
//         console.log("Task 2 completed");
//         return "Task 2 result";
//       });

//       issue.catch((error) => {
//         console.error("Error occurred:", error.message);
//       });

//       issue.pipe(() => {
//         console.log("Task 3 completed");
//         return "Task 3 result";
//       });

//       // 이슈 해결 실행
//       const { result, error } = Issue.solve(issue);
//       console.log(result, error);
//       // 결과 확인
//       expect(result).toEqual("Task 3 result");
//       expect(error).toBeNull();
//     });
//   });
// });
