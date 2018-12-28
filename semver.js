const semver = require("semver")
// const semverDiff = require("semver-diff")
//
// const npmVersionsAvailable = ["0.0.1", "0.0.2", "1.0.0", "1.0.1", "2.0.0"]
// const currentNpmVersionInLockFile = "^1.0.0"
//
// const getAvailableVersions = dependency => [
//   "0.0.1",
//   "0.0.2",
//   "1.0.0",
//   "1.0.1",
//   "2.0.0",
// ]
//
// const getNumberOfVersionsBack = dependency => {
//   const npmVersionsAvailable = getAvailableVersions(dependency)
//   return npmVersionsAvailable
//     .reverse()
//     .findIndex(version =>
//       semver.satisfies(currentNpmVersionInLockFile, version)
//     )
// }
//
//
// const versionThatFits = npmVersionsAvailable
//   .reverse()
//   .find(version => semver.satisfies(currentNpmVersionInLockFile, version))
//
// const judgeRating = dependencies => {
//   const numbersOfVersionsBackInEachPackage = dependencies.map(
//     getNumberOfVersionsBack
//   )
//   numbersOfVersionsBackInEachPackage.reduce(
//     (acc, versionsBack) => acc + versionsBack
//   )
// }

// console.log(semverDiff("1.0.0", "1.0.0"))

console.log(semver.clean("^1.2.3"))
