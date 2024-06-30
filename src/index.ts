import { Issue } from "@model/issue";
import { VERSION } from "./common/variable";

console.log(VERSION);

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
issue.catch = function customCatch(error: any) {
  console.log("custom catch", error.message);
};
issue.finally(() => {
  console.log("work");
});
const result = Issue.solve(issue);
if (result.error) {
  console.log("error 발생");
}

console.log(result.result);

async function test() {}
const prom = new Promise(() => {});
const test2 = async () => {};

console.log(test);
console.log(test2);

console.log(typeof test);
console.log(typeof test2);
console.log(typeof prom);
console.log(test2 instanceof Function);
console.log(test instanceof Function);
console.log(prom instanceof Promise);

console.log(test2.toString().startsWith("async"));
console.log(test.toString().startsWith("async"));
console.log(prom.toString());

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
