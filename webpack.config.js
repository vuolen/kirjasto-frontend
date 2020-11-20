const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.tsx',
  devtool: 'source-map',
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
    fallback: { 
        "util": false,
        "path": false,
        "crypto": false,
        "https": false,
        "http": false,
        "vm": false,
        "os": false,
        "fs": false,
        "buffer": false,
        "stream": false,
        "constants": false,
        "assert": false
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      'BACKEND_HOST': 'localhost',
      'BACKEND_PORT': '8000'
    })
  ]

};
