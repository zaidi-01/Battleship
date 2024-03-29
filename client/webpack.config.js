const path = require("path");

module.exports = {
  entry: "./src/main.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    alias: {
      "@constants": path.resolve(__dirname, "src/constants"),
      "@controllers": path.resolve(__dirname, "src/controllers"),
      "@components": path.resolve(__dirname, "src/components"),
      "@enums": path.resolve(__dirname, "src/enums"),
      "@interfaces": path.resolve(__dirname, "src/interfaces"),
      "@scenes": path.resolve(__dirname, "src/scenes"),
      "@services": path.resolve(__dirname, "src/services"),
      "@shared": path.resolve(__dirname, "src/shared"),
      "@utilities": path.resolve(__dirname, "src/utilities"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  mode: process.env.NODE_ENV || "development",
};
