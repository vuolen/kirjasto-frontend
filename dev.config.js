const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = env => ({
  mode: 'development',
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
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
    proxy: {
      "/api": {
        target: "http://" + process.env.BACKEND_URL,
        pathRewrite: {'^/api' : ''}
      }
    },
    historyApiFallback: true
  }
});
