module.exports = function printStats(stats) {
  const buildName = "asd"
  console.log(
    stats.toString({
      assets: true,
      chunks: true,
      children: true,
      colors: true,
    })
  )

  if (stats.hasWarnings()) {
    console.warn(`Above warning(s) occurred during build: ${buildName}`)
  }

  if (stats.hasErrors()) {
    console.error(`Above error(s) occurred during build: ${buildName}`)
  }
}
