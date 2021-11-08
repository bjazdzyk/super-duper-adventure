const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'development',
  entry: path.join(__dirname, '/main.js'),
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
}
