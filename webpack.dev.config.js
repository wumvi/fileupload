const jsonCommon = require('./webpack.common.config')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    dev: './dev/index.ts',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'dev/index.html',
    })],
  ...jsonCommon,
}
