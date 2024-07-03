import { Issue } from "@model/issue";
import { VERSION } from "./common/variable";
import { Logger } from "@model/logger";

const logger = new Logger("index");

logger.log(VERSION);

const issue = new Issue("Test Issue");
issue.throw = false;
issue.use(3);
issue.pipe((a: number) => {
  return a * 15;
});
issue.try((a) => {
  if (a > 10) {
    throw new Error("Issue Error");
  }
  return a;
});

issue.catch(function customCatch(error: any) {
  logger.log("custom catch", error.message);
});

issue.finally(() => {
  logger.log("work");
});

const result = Issue.solve(issue);
if (result.error) {
  logger.log("error 발생");
}

logger.log(result.result);

async function test() {}
const prom = new Promise(() => {});
const test2 = async () => {};

logger.log(test);
logger.log(test2);

logger.log(typeof test);
logger.log(typeof test2);
logger.log(typeof prom);
logger.log(test2 instanceof Function);
logger.log(test instanceof Function);
logger.log(prom instanceof Promise);

logger.log(test2.toString().startsWith("async"));
logger.log(test.toString().startsWith("async"));
logger.log(prom.toString());

async function testAsync() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(5);
    }, 5000);
  });
}

const issue2 = new Issue();
issue2.throw = true;
issue2.use(123);
issue2.pipe(testAsync);
const result2 = Issue.solveAsync(issue2);

result2.then((result) => {
  console.log(result);
});
