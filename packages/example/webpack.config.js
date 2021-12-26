const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const APP_PATH = path.resolve(__dirname, 'src', 'index.tsx');
const ASSET_PATH = process.env.ASSET_PATH || '/';
const output = process.env.output || 'dist';
module.exports = {
  entry: APP_PATH,
  devtool: 'source-map',
  output: {
    publicPath: ASSET_PATH,
    filename: 'bundle.js',
    path: path.resolve(__dirname, output)
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
    alias:{
      // "src": path.resolve('src')
    }
  },
  

  module: {
    rules: [
      { test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ },
      {
        test: [/\.txt$/i, /\.md$/i],
        use: 'raw-loader',
      },
      {
        test: [/\.module.css$/, /\.module.less$/],
        use: [
          'style-loader',
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        test: [/\.css$/, /\.less$/],
        exclude:[/\.module.css$/, /\.module.less$/],
        use: [
          'style-loader',
          {
            loader: "css-loader",
            options: {
              modules: false,
            },
          },
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

  plugins: [new HtmlWebpackPlugin({ inject: true, title:"noedit - By NoBey" }), new ForkTsCheckerWebpackPlugin()],

  performance: {
    hints: false
  },

  devServer: {
    host: 'localhost',
    port: 8080,
    compress: false,
    host: "0.0.0.0"
  },
  watchOptions: {
    aggregateTimeout: 500 //防抖 多少毫秒后再次触发
  }
};
