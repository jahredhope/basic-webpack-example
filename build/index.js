const MemoryFS = require("memory-fs")
const useMemoryFs = false

const fs = useMemoryFs ? new MemoryFS() : require("fs")
const chalk = require("chalk")
const getCompiler = require("./getCompiler")

async function onBuild(err) {
  if (err) {
    console.error(chalk.red("Error during build:"), err)
    return
  }
}

const compiler = getCompiler({ fs })
const runType = "run"
if (runType === "watch") {
  compiler.watch({}, onBuild)
} else if (runType === "run") {
  compiler.run(onBuild)
}
