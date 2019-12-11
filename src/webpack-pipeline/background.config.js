const path = require('path');
const commonConfig = require('./common.config');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = Object.assign({}, commonConfig, {
  entry: {
    background: path.resolve(__dirname, '../app/background.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../app/manifest.json'),
        to: 'manifest.json',
      },
      {
        from: path.resolve(__dirname, '../app/images'),
        to: 'images/',
      },
      {
        from: path.resolve(__dirname, '../app/_locales'),
        to: '_locales/',
      },
    ]),
    new MinifyPlugin(
      {
        propertyLiterals: false,
      },
      {
        comments: false,
      }
    ),
  ],
});
