const path = require('path');
const commonConfig = require('./common.config');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = Object.assign({}, commonConfig, {
  entry: {
    options: path.resolve(__dirname, '../app/options/options.js'),
  },
  output: {
    path: path.resolve(__dirname, '../dist/options'),
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../app/options/options.css'),
          to: 'options.css',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: 'options.html',
      minify: true,
      template: path.resolve(__dirname, '../app/options/options.html'),
    }),
    new HtmlWebpackTagsPlugin({
      tags: ['options.css'],
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
