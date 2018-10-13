const DevServer = require("webpack-dev-server")
const getCompiler = require("./getCompiler")
const compiler = getCompiler({ liveReload: true, mode: "development" })

const server = new DevServer(compiler, {
  compress: true,
})
server.listen(8080, "localhost", function() {})
