const path = require("path")
const MemoryFS = require("memory-fs")
const useMemoryFs = false

const fs = useMemoryFs ? new MemoryFS() : require("fs")
const cwd = process.cwd()

const middleware = require("webpack-dev-middleware")
const getCompiler = require("./getCompiler")
const compiler = getCompiler({ fs })
const express = require("express")
const app = express()

async function onBuild(err) {
  if (err) {
    console.error(chalk.red("Error during build:"), err)
    return
  }
}

compiler.watch({}, onBuild)

function urlToPath(url) {
  if (path.basename(url).includes(".")) {
    return path.join(cwd, "dist", url)
  }
  return path.join(cwd, "dist", url, "index.html")
}
app.get("*", (req, res) => {
  const dir = urlToPath(req.url)
  console.log({ url: req.url, dir })

  res.send(fs.readFileSync(dir, "utf8"))
})

app.listen(3000, () => console.log("Example app listening on port 3000!"))
