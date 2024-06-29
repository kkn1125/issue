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
