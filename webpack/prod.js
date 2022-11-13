import { merge } from "webpack-merge";
import commonConfig from "./common.js";
import CopyPlugin from "copy-webpack-plugin";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
const prodConfig = merge(commonConfig, {
  mode: "production",
  devtool: false,
  plugins: [
    ...commonConfig.plugins,
    new MonacoWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: "manifest.json",
        },
        {
          from: "src/style.css",
          to: "style.css",
        },
      ],
    }),
  ],
});

export default prodConfig;
