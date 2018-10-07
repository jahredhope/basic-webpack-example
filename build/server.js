const path = require("path")
const MemoryFS = require("memory-fs")
// const chalk = require("chalk")
const mkdirp = require("mkdirp")
const useMemoryFs = true

const fs = useMemoryFs ? new MemoryFS() : require("fs")
fs.mkdirp = (...args) => mkdirp(...args, { fs })
fs.join = path.join.bind(path)

const cwd = process.cwd()
const distDirectory = path.join(cwd, "dist")

const middleware = require("webpack-dev-middleware")
const getCompiler = require("./getCompiler")
const compiler = getCompiler({ fs })
const express = require("express")
const app = express()

fs.mkdirp(distDirectory)

// async function onBuild(err) {
//   if (err) {
//     console.error(chalk.red("Error during build:"), err)
//     return
//   }
// }

// compiler.watch({}, onBuild)

app.use(middleware(compiler, { fs }))

// function urlToPath(url) {
//   if (path.basename(url).includes(".")) {
//     return path.join(cwd, "dist", url)
//   }
//   return path.join(cwd, "dist", url, "index.html")
// }
app.get("*", (req, res) => {
  // const dir = urlToPath(req.url)
  console.log({ url: req.url })

  res.send(req.url)
})

app.listen(3000, () => console.log("Example app listening on port 3000!"))
