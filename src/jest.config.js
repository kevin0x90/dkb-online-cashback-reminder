// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: "test/coverage",

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    "\\\\node_modules\\\\"
  ],

  // Make calling deprecated APIs throw helpful error messages
  errorOnDeprecated: true,

  // A set of global variables that need to be available in all test environments
  // globals: {},

  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: [
    "node_modules",
    "app/lib"
  ],

  // An array of file extensions your modules use
  moduleFileExtensions: [
    "js",
    "json",
    "jsx",
    "ts",
    "tsx",
    "node"
  ],

  // Automatically reset mock state between every test
  resetMocks: true,

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    "<rootDir>/test",
    "<rootDir>/app"
  ],

  // Allows you to use a custom runner instead of Jest's default test runner
  runner: "jest-runner",

  // The test environment that will be used for testing
  testEnvironment: "jest-environment-jsdom",

  // The glob patterns Jest uses to detect test files
  testMatch: [
    "**/*Spec.js"
  ],

  // This option allows use of a custom test runner
  testRunner: "jasmine2",

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  testURL: "http://localhost",

  // Setting this value to "fake" allows the use of fake timers for functions such as "setTimeout"
  timers: "real",

  // Whether to use watchman for file crawling
  watchman: true,
};
