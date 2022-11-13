/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  // The bail config option can be used here to have Jest stop running tests after
  // the first failure.
  bail: false,
  // Indicates whether each individual test should be reported during the run.
  verbose: true,
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: false,

  preset: "ts-jest",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  // The directory where Jest should output its coverage files.
  coverageDirectory: "./coverage/",
};
