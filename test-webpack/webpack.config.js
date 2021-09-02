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
    clean: true
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
        use: ['style-loader', 'css-loader', // 'yzz-sprite-loader'
        {
          loader: path.resolve('../test-sprites-loader/index.js'),
          options: {
            dist: "./src/sprites" // 雪碧图保存路径（TODO:注意当output的clean设为true时，需要keep一下dist下面的路径，否则生成后可能会被删掉，应该是loader的执行时机问题）
          }
        },
      ]
      },
      // {
      //   test: /\.css$/i,
      //   use: [
      //     {
      //       loader: path.resolve('../test-sprites-loader/index.js'),
      //       options: {
      //         dist: "./src/sprites" // 雪碧图保存路径（TODO:注意当output的clean设为true时，需要keep一下dist下面的路径，否则生成后可能会被删掉，应该是loader的执行时机问题）
      //       }
      //     },
      //   ],
      // },
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
}