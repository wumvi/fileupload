const jsonCommon = require('./webpack.common.config')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'index': './src/index.ts',
    'index.min': './src/index.ts',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'index',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [new TerserPlugin({
      include: /\.min\.js$/,
      sourceMap: true,
    })],
  },
  externals: {
    '@wumvi/jsonapi': '*',
  },
  ...jsonCommon
}