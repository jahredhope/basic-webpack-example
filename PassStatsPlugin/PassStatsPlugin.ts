import { DefinePlugin, Compiler, compilation, Stats } from "webpack";
// @ts-ignore: Not directly exposed as a type
import MultiStats from "webpack/lib/MultiStats";

import debug from "debug";

const pluginName = "PassStatsPlugin";
const log = debug(pluginName);

interface CompilationStatus {
  compilation: compilation.Compilation | null;
  isReady: boolean;
}

interface Options {
  toJsonOptions?: Stats.ToJsonOptions;
}

export default function createPassStatsPlugin({
  toJsonOptions = {},
}: Options = {}) {
  const collectorCompilations: CompilationStatus[] = [];
  let currentStats: Stats.ToJsonOutput | null = null;

  const isBuildReady = () =>
    collectorCompilations.every(
      (compilationStatus) => compilationStatus.isReady
    );

  const getClientStats = () => {
    if (currentStats) {
      return currentStats;
    }
    const compilations = collectorCompilations
      .map((c) => c.compilation)
      .filter(Boolean);
    const clientStats =
      compilations.length === 1
        ? compilations[0].getStats()
        : new MultiStats(
            compilations
              .filter(Boolean)
              .map((compilation) => compilation.getStats())
          );

    currentStats = clientStats.toJson(toJsonOptions);
    return currentStats;
  };

  return {
    statsCollectorPlugin: (compiler: Compiler) => {
      const compilerName = compiler.name || compiler.options.name;

      const compilationStatus: CompilationStatus = {
        compilation: null,
        isReady: false,
      };

      log(`Received statsCollector compiler: ${compilerName}`);

      collectorCompilations.push(compilationStatus);

      compiler.hooks.watchRun.tap(pluginName, () => {
        log(`Build started for for ${compilerName}.`);
        compilationStatus.isReady = false;
      });

      compiler.hooks.afterEmit.tapPromise(pluginName, async (compilation) => {
        log(`Assets emitted for ${compilerName}.`);
        compilationStatus.compilation = compilation;
        currentStats = null;
        compilationStatus.isReady = true;
      });
    },
    statsReaderPlugin: (compiler: Compiler) => {
      const compilerName = compiler.name || compiler.options.name;
      log(`Received statsReader compiler: ${compilerName}`);

      const definePlugin = new DefinePlugin({
        WEBPACK_STATS: DefinePlugin.runtimeValue(({ module }) => {
          if (!isBuildReady()) {
            console.error(
              "Attempting to request WEBPACK_STATS when stats are not ready"
            );
            const error = new Error(
              "Attempting to request WEBPACK_STATS when stats are not ready"
            );
            module.errors.push(error);
            return JSON.stringify(
              "Attempting to request WEBPACK_STATS when stats are not ready"
            );
          }
          log("Requesting WEBPACK_STATS value");
          return JSON.stringify(getClientStats());
          // @ts-ignore: Pass true to tell DefinePlugin the module is not cacheable
        }, true),
      });
      definePlugin.apply(compiler);
    },
  };
}
