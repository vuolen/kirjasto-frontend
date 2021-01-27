const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = merge(commone, {
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.EnvironmentPlugin([
      'BACKEND_URL'
    ]),
    new webpack.HotModuleReplacementPlugin({
    }),
    new HtmlWebpackPlugin({
      title: "Kirjasto",
      template: "src/index.html"
    })
  ],
  devServer: {
    contentBase: './dist',
    index: 'index.html',
    hot: true,
    inline: true,
    host: "0.0.0.0",
    disableHostCheck: true,
    https: true,
    proxy: {
      "/api": {
        target: "http://" + process.env.BACKEND_URL,
        pathRewrite: {'^/api' : ''}
      }
    },
    historyApiFallback: true
  }
});
