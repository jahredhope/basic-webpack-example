module.exports = function printStats(stats) {
  console.log(
    stats.toString({
      assets: true,
      chunks: false,
      errors: true,
      errorDetails: true,
      hash: false,
      performance: false,
      reasons: false,
      version: false,
      children: true,
      colors: true,
    })
  )

  if (stats.hasWarnings()) {
    console.warn(`Above warning(s) occurred during build`)
  } else {
    console.log("No Warnings")
  }

  if (stats.hasErrors()) {
    console.error(`Above error(s) occurred during build`)
  } else {
    console.log("No Errors")
  }
}
