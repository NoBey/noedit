const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const APP_PATH = path.resolve(__dirname, 'src', 'index.tsx');

module.exports = {
  entry: APP_PATH,

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },

  module: {
    rules: [
      { test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: [/\.css$/, /\.less$/],
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      }
    ]
  },

  plugins: [new HtmlWebpackPlugin({ inject: true }), new ForkTsCheckerWebpackPlugin()],

  performance: {
    hints: false
  },

  devServer: {
    host: 'localhost',
    port: 8080,
    compress: false
  },
  watchOptions: {
    aggregateTimeout: 500 //防抖 多少毫秒后再次触发
  }
};
