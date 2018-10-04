const merge = require("webpack-merge");
const path = require("path");
const cwd = process.cwd();
const srcPath = path.resolve(cwd, "./src");
const paths = {
  renderEntry: path.resolve(srcPath, "render.js"),
  clientEntry: path.resolve(srcPath, "client.js")
};

const common = {
  mode: "development",
  output: {
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};

module.exports = [
  merge(common, {
    output: {
      filename: "client-[name]-[contenthash].js"
    },
    optimization: {
      runtimeChunk: {
        name: "manifest"
      }
    },
    name: "client",
    target: "web",
    entry: { client: paths.clientEntry }
  }),
  merge(common, {
    output: {
      libraryTarget: "umd2",
      filename: "render-[name]-[contenthash].js"
    },
    name: "render",
    target: "node",
    entry: { render: paths.renderEntry }
  })
];
