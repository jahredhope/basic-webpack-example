const webpack = require("webpack")
const DevServer = require("webpack-dev-server")
const config = require("../webpack.config.js")

const server = new DevServer(webpack(config), {
  compress: true,
})

server.listen(8080, "localhost", (err, res) => {
  if (err) {
    console.error("Error during build:", err)
    return
  }
  console.log("Build started successfully")
  if (res) {
    console.log("Build result:", res)
  }
})
