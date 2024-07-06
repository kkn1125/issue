import { Issue, Solved } from "@model/issue";
import { describe, expect, it, vitest } from "vitest";
import pkg from "../../package.json";
import { IssueProtocol } from "@common/enum";

Issue.mode = "development";

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
      issue.pipe((issue, [aa]: [number]) => {
        issue.logger.debug("aa is:", aa, "c is:", c);
        return Issue.util.safeDiv(aa, c);
      });

      issue.logger.debug("expected value is:", Issue.util.safeDiv(a + b, c));
      issue.logger.log(Issue.solve(issue).trace);
      issue.logger.log(issue.taskTrace.show());

      expect(Issue.solve(issue).error).not.toBeNull();
      issue.logger.log(issue.taskTrace.show());
      expect(Issue.solve(issue).result).toStrictEqual(
        Issue.util.safeDiv(a + b, c)
      );
      issue.logger.log(Issue.solve(issue).trace);
      expect(Issue.solve(issue).trace.length).toStrictEqual(5);
      expect(Issue.solve(issue).trace[0].code).toStrictEqual(
        IssueProtocol.USING[0]
      );
      expect(Issue.solve(issue).trace[2].code).toStrictEqual(
        IssueProtocol.DOING[0]
      );
    });
  });

  describe("[Issue Pipeline]", () => {
    it("Issue pipeline usage", () => {
      const issue = Issue.task("My Issue");
      const text =
        "안녕하세요. 테스트 대본입니다. 이 대본은 파이프라인을 통해 처리됩니다.";

      function handleWork(issue: Issue, [a, b]: [string, boolean]) {
        console.log(b);
        if (a.includes("테스트 대본")) {
          issue.taskTrace.write({
            protocol: "OUT",
            detail: "대본이네?",
          });
        }
        return text;
      }

      function handleWork2(_issue: Issue, [a]: [string]) {
        return a.replace(/파이프라인을 통해 처리됩니다./, "처리 되었습니다.");
      }

      const issueArgs: [string, boolean] = [text, true];
      issue.use<[string, boolean]>(issueArgs);
      issue.pipe<[string, boolean], string>(handleWork);
      issue.pipe<[string], string>(handleWork2);

      const { result, error: _error, trace } = Issue.solve(issue);
      expect(result).toStrictEqual(
        "안녕하세요. 테스트 대본입니다. 이 대본은 처리 되었습니다."
      );
    });
  });

  describe("[Issue Pipeline and try catch]", () => {
    it("Issue try catch", () => {
      const issue = Issue.task("try catch");

      const issueTrySpy = vitest.spyOn(issue, "try");
      const issueSolveSpy = vitest.spyOn(Issue, "solve");

      issue.try(() => {
        return JSON.parse("/");
      });

      const { result, error } = Issue.solve(issue);

      expect(issueTrySpy).toBeCalled();
      expect(issueTrySpy).toBeCalledTimes(1);
      expect(issueSolveSpy).toBeCalled();
      expect(issueSolveSpy).toBeCalledTimes(1);

      expect(Issue.solve).toThrow();
      expect(error).toBeDefined();
    });
  });

  describe("[Issue Pipeline Package Test]", () => {
    it("Issue pipeline packaging", () => {
      const pkg = Issue.task("Issue package");
      const subTask = Issue.task("Sub task");
      let randomValue;

      subTask.pipe((issue) => {
        const random = Math.random();
        randomValue = random;
        return random;
      });

      pkg.use([subTask]);
      pkg.pipe<[Issue], Solved>(function (issue: Issue, [sub]) {
        return Issue.solve(sub);
      });

      const solve = Issue.solve<Solved>(pkg);
      Issue.logger.debug(solve.result);
      expect(solve.result?.result).toStrictEqual(randomValue);

      const solve2 = Issue.solve<Solved>(pkg);
      Issue.logger.debug(solve2.result);
      expect(solve2.result?.result).toStrictEqual(randomValue);
    });
  });
});
