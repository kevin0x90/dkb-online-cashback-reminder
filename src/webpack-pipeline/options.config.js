const path = require('path');
const commonConfig = require('./common.config');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = Object.assign({}, commonConfig, {
  entry: {
    options: path.resolve(__dirname, '../app/options/options.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist/options')
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../app/options/options.css'),
        to: 'options.css'
      }
    ]),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      minify: true,
      template: path.resolve(__dirname, '../app/options/options.html')
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['options.css'],
      append: true
    }),
    new MinifyPlugin()
  ]
});