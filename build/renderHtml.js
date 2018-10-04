const path = require("path");
module.exports = async function renderHtml({
  renderStats,
  clientStats,
  assetsDirectory,
  renderDirectory,
  fs
}) {
  const renderFile = renderStats
    .toJson()
    .chunks.find(chunk => chunk.id === "render").files[0];
  console.log({ renderFile });
  // const renderCode = fs.readFileSync(
  //   path.join(distDirectory, renderFile),
  //   "utf8"
  // );
  // console.log({ renderCode });
  // const renderModule = evaluate(renderCode, renderFile, {}, true);
  const renderModule = require(path.join(assetsDirectory, renderFile));
  console.log({ renderModule });
  console.log("Running consumer code");
  const renderResult = await renderModule.default({
    clientStats: clientStats.toJson(),
    renderStats: renderStats.toJson()
  });
  console.log("Ending consumer code");

  if (typeof renderResult !== "string") {
    throw new Error(
      `Render must return a string. Recieved ${typeof renderResult}.`
    );
  }

  fs.writeFileSync(path.join(renderDirectory, "index.html"), renderResult);
};
