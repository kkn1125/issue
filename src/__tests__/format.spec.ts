import { format, formatStamp } from "@lib/format";
import { describe, expect, it } from "vitest";

describe("format test", () => {
  it("now format test", () => {
    const formed = format(new Date(2024, 7, 4, 12, 41), "YYYY-MM-dd HH:mm");
    expect(formed).toStrictEqual("2024-07-04 00:41");
  });
  it("use ap format test", () => {
    const formed = format(new Date(2024, 7, 4, 12, 41), "YYYY-MM-dd AP HH:mm");
    expect(formed).toStrictEqual("2024-07-04 PM 00:41");
  });
  it("use h24 format test", () => {
    const formed = format(new Date(2024, 7, 4, 15, 41), "YYYY-MM-dd HH:mm", {
      h24: true,
    });
    expect(formed).toStrictEqual("2024-07-04 15:41");
  });
  it("no use h24 format test", () => {
    const formed = format(new Date(2024, 7, 4, 15, 41), "YYYY-MM-dd HH:mm", {
      h24: false,
    });
    expect(formed).toStrictEqual("2024-07-04 03:41");
  });
  it("use ap no use h24 format test", () => {
    const formed = format(new Date(2024, 7, 4, 15, 41), "YYYY-MM-dd AP HH:mm", {
      h24: false,
    });
    expect(formed).toStrictEqual("2024-07-04 PM 03:41");
  });
  it("timestamp test", () => {
    const formed = formatStamp(
      1000 * 60 * 60 + 1000 * 60 * 3 + 1000 * 5 + 1000 * 0.365
    );
    expect(formed).toStrictEqual("1:3:5");
  });
  it("timestamp test: show ms", () => {
    const formed = formatStamp(
      1000 * 60 * 60 + 1000 * 60 * 3 + 1000 * 5 + 1000 * 0.365,
      {
        showMs: true,
      }
    );
    expect(formed).toStrictEqual("1:3:5.365");
  });
  it("timestamp test: show ms and padding", () => {
    const formed = formatStamp(
      1000 * 60 * 60 + 1000 * 60 * 3 + 1000 * 5 + 1000 * 0.065,
      {
        showMs: true,
        padding: true,
      }
    );
    expect(formed).toStrictEqual("01:03:05.065");
  });
  it("timestamp test: just padding", () => {
    const formed = formatStamp(
      1000 * 60 * 60 + 1000 * 60 * 3 + 1000 * 5 + 1000 * 0.065,
      {
        padding: true,
      }
    );
    expect(formed).toStrictEqual("01:03:05");
  });
});
