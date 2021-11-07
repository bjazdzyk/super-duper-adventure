const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const compiler = webpack({
  mode: 'development',
  entry: './main.js',
  output: {
    filename: '[contenthash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, '/index.html'),
      inject: 'head'
    })
  ]
})
const express = require('express')
const app = express()

app.use(
  middleware(compiler, {
    // webpack-dev-middleware options
  })
)

app.listen(8080, () => console.log('Example app listening on port 8080!'))
