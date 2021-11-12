const merge = require('webpack-merge')
const config = require('./webpack.common.js')

module.exports = merge.merge(config, {
  devtool: 'inline-source-map',
  mode: 'development'
})
