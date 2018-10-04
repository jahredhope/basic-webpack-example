module.exports = {
  parser: "babel-eslint",
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  rules: {
    "no-console": "off"
  }
};
