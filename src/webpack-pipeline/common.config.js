const path = require('path');

module.exports = {
  mode: 'development',
  target: 'web',
  context: path.resolve(__dirname, '../app'),
  output: {
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, '../app')
        ],
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    modules: [
      'node_modules',
      path.resolve(__dirname, '../app')
    ],
    extensions: [
      '.js'
    ]
  },
  devtool: 'cheap-source-map'
};