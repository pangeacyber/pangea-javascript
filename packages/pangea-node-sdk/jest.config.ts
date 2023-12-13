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
  bail: true,
  verbose: true,
  coverageDirectory: "./coverage/",
  globals: {
    "ts-jest": {
      /**
       * Needed because importing hash-wasm causes jest to hang
       *
       * from: https://github.com/kulshekhar/ts-jest/issues/3507#issuecomment-1136761818
       */
      isolatedModules: true,
      useESM: true,
    },
  },
};

export default jestConfig;
