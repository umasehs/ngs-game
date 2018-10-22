const DynamicCdnPlugin = require("dynamic-cdn-webpack-plugin");
const FaviconsPlugin = require("favicons-webpack-plugin");
const PreloadPlugin = require("preload-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

module.exports = function override(config, env) {
  // ...
  config.plugins = (config.plugins || []).concat([
    new FaviconsPlugin({
      logo: "./src/gameLogo.png",
      persistentCache: false,
      prefix: "static/media/icons/",
      title: "NGS Game"
    }),
    new PreloadPlugin({ rel: "prefetch" })
  ]);

  if (env === "production") {
    config.plugins = (config.plugins || []).concat([
      new DynamicCdnPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        reportFilename: "report.html"
      })
    ]);
  }

  return config;
};
