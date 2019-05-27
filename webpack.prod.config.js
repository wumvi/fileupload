const jsonCommon = require('./webpack.common.config')
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'fileupload': './src/fileupload.ts',
    'fileupload.min': './src/fileupload.ts',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'fileupload',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  optimization: {
    minimizer: [new TerserPlugin({
      include: /\.min\.js$/,
      sourceMap: true,
    })],
  },
  ...jsonCommon
}