module.exports = {
  preset: "ts-jest/presets/js-with-babel",
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true
      }
    }
  },
  globalSetup: "./jest/setup.js",
  globalTeardown: "./jest/teardown.js",
  testEnvironment: "./jest/puppeteer_environment.js"
};
