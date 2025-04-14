import { RelativeRange } from "./types";
import {
  getRelativeDateRange,
  compareRelativeDateRanges,
  getHalfRelativeDateRange,
} from "./utils";

describe("getRelativeDateRange should", () => {
  it("should match expected", () => {
    expect(getRelativeDateRange("1M")).toStrictEqual({
      amount: 1,
      span: "month",
      relativeRange: RelativeRange.Month,
      prefix: "",
    });
    expect(getRelativeDateRange("1m")).toStrictEqual({
      amount: 1,
      span: "minute",
      relativeRange: RelativeRange.Minute,
      prefix: "",
    });
  });
});

describe("compareRelativeDateRanges should", () => {
  it("should match expected", () => {
    expect(compareRelativeDateRanges("1m", "90d")).toEqual(-1);
    expect(compareRelativeDateRanges("1m", "1w")).toEqual(-1);
    expect(compareRelativeDateRanges("1M", "1w")).toEqual(1);
    expect(compareRelativeDateRanges("1y", "12m")).toEqual(1);
    expect(compareRelativeDateRanges("1y", "13M")).toEqual(-1);
  });
});

describe("getHalfRelativeDateRange", () => {
  test("should return half of a whole number amount", () => {
    expect(getHalfRelativeDateRange("4year")).toEqual({
      amount: 2,
      span: "year",
      relativeRange: "year",
      prefix: "",
    });
    expect(getHalfRelativeDateRange("6week")).toEqual({
      amount: 3,
      span: "week",
      relativeRange: "week",
      prefix: "",
    });
  });

  test("should move to a smaller unit when the halved amount is less than 1", () => {
    expect(getHalfRelativeDateRange("1year")).toEqual({
      amount: 6,
      span: "month",
      relativeRange: "month",
      prefix: "",
    });
    expect(getHalfRelativeDateRange("1day")).toEqual({
      amount: 12,
      span: "hour",
      relativeRange: "hour",
      prefix: "",
    });
  });

  test("should handle invalid inputs gracefully", () => {
    expect(getHalfRelativeDateRange("invalid")).toEqual({
      amount: 0,
      span: "day",
      relativeRange: "day",
      prefix: "",
    });
    expect(getHalfRelativeDateRange("")).toEqual({
      amount: 0,
      span: "day",
      relativeRange: "day",
      prefix: "",
    });
  });
});
