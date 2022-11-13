import { resolve } from "node:path";
import webpack from "webpack";

const commonConfig = {
  entry: {
    main: resolve("src/main.jsx"),
  },
  output: {
    publicPath: "",
    path: resolve("dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".wasm"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              noEmit: false,
            },
          },
        },
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
        ],
      },

      {
        test: /\.svg$/i,
        use: ["@svgr/webpack"],
      },

      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  devtool: "cheap-eval-source-map",
};
export default commonConfig;
