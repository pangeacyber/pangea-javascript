// @ts-check

/** @type {import("jest").Config} */
const jestConfig = {
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
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
