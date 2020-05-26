module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          node: "14.3",
        },
      },
    ],
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
    "@babel/plugin-proposal-optional-chaining",
    "@loadable/babel-plugin",
    [
      "babel-plugin-module-resolver",
      {
        root: [process.cwd()],
        extensions: [".mjs", ".js", ".json", ".ts", ".tsx"],
      },
    ],
    "emotion",
  ],
};
