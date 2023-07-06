import type { JestConfigWithTsJest } from "ts-jest";

const jestConfig: JestConfigWithTsJest = {
  preset: "ts-jest/presets/default-esm", // or other ESM presets
  testEnvironment: "node",
  roots: ["<rootDir>"],
  modulePaths: ["."],
  extensionsToTreatAsEsm: [".ts"],
  moduleNameMapper: {
    "^@src/(.*)\\.js$": "<rootDir>/src/$1.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  bail: false,
  verbose: true,
  coverageDirectory: "./coverage/",
};

export default jestConfig;
