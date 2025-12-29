const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  chainWebpack: (config) => {
    config.performance.maxEntrypointSize(4000000).maxAssetSize(4000000);
    config.plugin("copy").tap((args) => {
      const patterns = args[0] && args[0].patterns ? args[0].patterns : [];
      const first = patterns[0];
      if (first && first.globOptions && Array.isArray(first.globOptions.ignore)) {
        first.globOptions.ignore.push("**/index.html");
      }
      return args;
    });
  },
});
