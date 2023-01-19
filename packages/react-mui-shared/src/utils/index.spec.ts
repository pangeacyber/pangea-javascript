import { getISO } from ".";

describe("getISO should", () => {
  it("should work with date string", () => {
    expect(
      getISO("Tue Oct 04 2022 09:22:34 GMT-0700 (Pacific Daylight Time)")
    ).toStrictEqual("2022-10-04T16:22:34.000Z");
  });
});
