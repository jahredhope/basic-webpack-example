module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript",
  ],
  plugins: [
    "@babel/plugin-syntax-dynamic-import",
    "@babel/plugin-proposal-class-properties",
    "@loadable/babel-plugin",
    [
      "babel-plugin-module-resolver",
      {
        root: [process.cwd()],
        extensions: [".mjs", ".js", ".json", ".ts", ".tsx"],
      },
    ],
  ],
};
