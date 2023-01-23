import {
  getRelativeDateRange,
  RelativeRange,
  compareRelativeDateRanges,
} from ".";

describe("getRelativeDateRange should", () => {
  it("should match expected", () => {
    expect(getRelativeDateRange("1M")).toStrictEqual({
      amount: 1,
      span: "M",
      relativeRange: RelativeRange.Month,
      prefix: "",
    });
    expect(getRelativeDateRange("1m")).toStrictEqual({
      amount: 1,
      span: "m",
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
