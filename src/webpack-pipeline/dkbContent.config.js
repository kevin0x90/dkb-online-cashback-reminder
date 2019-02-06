const path = require('path');
const commonConfig = require('./common.config');

const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = Object.assign({}, commonConfig, {
  entry: {
    content: path.resolve(__dirname, '../app/dkb-content/content.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist/dkb-content')
  },
  plugins: [
    new MinifyPlugin({
      propertyLiterals: false
    },
    {
      comments: false
    })
  ]
});