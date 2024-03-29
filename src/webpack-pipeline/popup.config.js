const path = require('path');
const commonConfig = require('./common.config');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = Object.assign({}, commonConfig, {
  entry: {
    popup: path.resolve(__dirname, '../app/popup/popup.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist/popup'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../app/popup/popup.css'),
          to: 'popup.css',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      minify: true,
      template: path.resolve(__dirname, '../app/popup/popup.html'),
    }),
    new HtmlWebpackTagsPlugin({
      tags: ['popup.css'],
      append: true,
    }),
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
