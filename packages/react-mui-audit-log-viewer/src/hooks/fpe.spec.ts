import { Change } from "./diff";
import {
  updateMatches,
  FPEMatch,
  injectFPEMatchesIntoChanges,
  FPE_REDACTION_INFO,
} from "./fpe";

describe("updateMatches should", () => {
  it("updateMatches should correctly adjust starting characters relative to the entire string", () => {
    const jsonString: string =
      '{"name": "John Doe", "address": {"street": "123 Main St", "city": "Anytown"}}';
    const matches: FPEMatch[] = [
      { a: "alphabet", s: 0, e: 4, k: "name" },
      { a: "alphabet", s: 0, e: 3, k: "address.city" },
    ];

    const updatedMatches = updateMatches(jsonString, matches);

    expect(updatedMatches).toStrictEqual([
      { a: "alphabet", s: 9, e: 13, k: "name" },
      { a: "alphabet", s: 61, e: 64, k: "address.city" },
    ]);
  });

  it("updateMatches should special path character", () => {
    const jsonString: string =
      '{"~name": "John Doe", "address": {"street": "123 Main St", "city.town": "Anytown"}}';
    const matches: FPEMatch[] = [
      { a: "alphabet", s: 0, e: 4, k: "~1name" },
      { a: "alphabet", s: 0, e: 3, k: "address.city~0town" },
    ];

    const updatedMatches = updateMatches(jsonString, matches);

    expect(updatedMatches).toStrictEqual([
      { a: "alphabet", s: 10, e: 14, k: "~1name" },
      { a: "alphabet", s: 67, e: 70, k: "address.city~0town" },
    ]);
  });
});

describe("injectFPEMatchesIntoChanges should", () => {
  it("injectFPEMatchesIntoChanges should correctly inject redaction into change list", () => {
    const matches: FPEMatch[] = [
      { a: "alphabet", s: 5, e: 10, k: "example" },
      { a: "alphabet", s: 15, e: 20, k: "example" },
    ];

    const changes: Change[] = [
      { value: "Hello World! This is a test string." },
    ];

    const updatedChanges = injectFPEMatchesIntoChanges(matches, changes);

    expect(changes.map((change) => change.value).join("")).toEqual(
      updatedChanges.map((change) => change.value).join("")
    );
    expect(updatedChanges).toStrictEqual([
      { value: "Hello" },
      {
        value: " Worl",
        redacted: true,
        prefix: "o",
        suffix: "d",
        info: FPE_REDACTION_INFO,
      },
      { value: "d! Th" },
      {
        value: "is is",
        redacted: true,
        prefix: "h",
        suffix: " ",
        info: FPE_REDACTION_INFO,
      },
      { value: " a test string." },
    ]);
    expect(changes.map((change) => change.value).join("")).toEqual(
      updatedChanges.map((change) => change.value).join("")
    );
  });

  it("injectFPEMatchesIntoChanges should correctly inject redaction into split change list", () => {
    const matches: FPEMatch[] = [
      { a: "alphabet", s: 5, e: 10, k: "example" },
      { a: "alphabet", s: 15, e: 20, k: "example" },
    ];

    const changes: Change[] = [
      { value: "Hello Wor", added: true },
      { value: "ld! This is a test string." },
    ];

    const updatedChanges = injectFPEMatchesIntoChanges(matches, changes);

    expect(changes.map((change) => change.value).join("")).toEqual(
      updatedChanges.map((change) => change.value).join("")
    );
    expect(updatedChanges).toStrictEqual([
      { value: "Hello", added: true },
      {
        value: " Worl",
        redacted: true,
        prefix: "o",
        suffix: "d",
        info: FPE_REDACTION_INFO,
      },
      { value: "d! Th" },
      {
        value: "is is",
        redacted: true,
        prefix: "h",
        suffix: " ",
        info: FPE_REDACTION_INFO,
      },
      { value: " a test string." },
    ]);
    expect(changes.map((change) => change.value).join("")).toEqual(
      updatedChanges.map((change) => change.value).join("")
    );
  });
});
