module.exports = {
  parser: "babel-eslint",
  extends: ["eslint:recommended", "plugin:react/recommended"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  settings: {
    react: { version: "detect" },
  },
  env: {
    es6: true,
    browser: true,
    node: true,
  },
  rules: {
    "no-console": "off",
    "no-inner-declarations": "off",
  },
};
