import { hasObjectIn, isNil } from "@common/feature";
import { describe, expect, it } from "vitest";

describe("feature test suite", () => {
  it("isNil Test", () => {
    console.log("isNil Test start");
    const object = {
      name: "test",
      age: 32,
      height: null,
      hobby: undefined,
    };

    console.log("test object:", JSON.stringify(object, null, 2));

    expect(isNil(object.height)).toStrictEqual(true);
  });

  it("hasObjcetIn Test", () => {
    console.log("hasObjcetIn Test start");
    const object = {
      name: "test",
      age: 32,
      height: null,
      hobby: undefined,
    };

    if (hasObjectIn(object, "age")) {
      expect(object.age).toStrictEqual(32);
    }
  });
});
