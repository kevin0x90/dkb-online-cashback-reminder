const path = require('path');
const commonConfig = require('./common.config');

module.exports = Object.assign({}, commonConfig, {
  entry: {
    content: path.resolve(__dirname, '../app/dkb-content/content.js')
  },
  output: {
    path: path.resolve(__dirname, '../dist/dkb-content')
  }
});