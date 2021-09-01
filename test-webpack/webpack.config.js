const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].' + Date.now() + ".bundle.min.js",
    path: path.resolve(__dirname, 'dist'),
    clean: {
      keep: /sprites\//, // 保留 'sprites/' 下的静态资源
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "Webpack~"
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: path.resolve('../test-sprites-loader/index.js'),
          },
        ],
      },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}