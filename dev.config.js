const path = require('path');
const webpack = require('webpack');

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
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new webpack.EnvironmentPlugin([
      'BACKEND_URL'
    ]),
    new webpack.HotModuleReplacementPlugin({
    })
  ],
  devServer: {
    contentBase: './dist',
    index: 'index.html',
    hot: true,
    inline: true,
    host: "0.0.0.0",
    disableHostCheck: true
  }
});
