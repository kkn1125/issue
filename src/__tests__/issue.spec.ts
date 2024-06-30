import { Issue } from "@model/issue";
import { describe, expect, it } from "vitest";

describe("Test", () => {
  it("Test", () => {
    console.log("[Test]: Test Case");
    expect("1").toStrictEqual("1");
  });
});

describe("Issue Class Test", () => {
  it("Issue has static version method", () => {
    console.log("[Issue Class Test]: Issue has static version method");
    expect("version" in Issue).toBeTruthy();
  });

  it("static version is 1.0.0", () => {
    console.log("[Issue Class Test]: static version is 1.0.0");
    const currentVersion = "0.0.1";
    expect(Issue.version).toStrictEqual(currentVersion);
  });
});

describe("Issue Class Test", () => {
  let issue: Issue;

  describe("Issue class Test: create new issue", () => {
    it("new issue", () => {
      issue = new Issue();

      expect(issue).toBeDefined();
    });
  });
});

describe("Issue design Test", () => {
  let issue: Issue;
  describe("basic design", () => {
    it("exception handle design: before use issue", () => {
      const numA = Math.floor(Math.random() * 10);
      const numB = Math.floor(Math.random() * 10);

      function calcSum(a: number, b: number) {
        return a + b;
      }

      function calcDiv(a: number, b: number) {
        return a / b;
      }

      issue = new Issue();

      expect(calcSum(numA, numB)).toStrictEqual(numA + numB);
      expect(calcDiv(numA, numB)).toStrictEqual(numA / numB);
    });

    it("exception handle design: after use issue", () => {
      const numA = Math.floor(Math.random() * 10);
      const numB = Math.floor(Math.random() * 10);

      function calcSum(a: number, b: number) {
        return a + b;
      }

      function calcDiv(a: number, b: number) {
        return a / b;
      }

      function calcTest(a: number) {
        return [a - 5, 16];
      }

      function calcTest2(a: number, b: number) {
        console.log(a, b);
        console.log("check", a + b);
        return a + b;
      }

      issue = Issue.task("solv calc Sum");
      issue.use(numA, numB);
      issue.pipe(calcSum);
      expect(Issue.solve(issue)).toStrictEqual(numA + numB);

      issue = Issue.task("solv calc Div");
      issue.use(numA, numB);
      issue.pipe(calcDiv);
      expect(Issue.solve(issue)).toStrictEqual(numA / numB);

      issue = Issue.task("solv calc Div");
      issue.use(numA, numB);
      issue.pipe(calcDiv);
      issue.pipe(calcTest);
      issue.pipe(calcTest2);
      expect(Issue.solve(issue)).toStrictEqual(numA / numB - 5 + 16);
      console.log("is matched", numA / numB - 5 + 16);

      // expect(calcSum(numA, numB)).toStrictEqual(numA + numB);
      // expect(calcDiv(numA, numB)).toStrictEqual(numA / numB);
    });
  });
});
