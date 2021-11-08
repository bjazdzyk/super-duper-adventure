const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const compiler = webpack(require('./src/webpack.dev.js'))
const express = require('express')
const app = express()

app.use(
  middleware(compiler, {
    // webpack-dev-middleware options
  })
)

app.listen(8080, () => console.log('Example app listening on port 8080!'))
