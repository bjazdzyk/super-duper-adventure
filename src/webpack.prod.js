const merge = require('webpack-merge')
const config = require('./webpack.common.js')
const webpack = require('webpack')

module.exports = merge.merge(config, {
	mode: 'production'
})
