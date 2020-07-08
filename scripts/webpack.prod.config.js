const webpack = require('webpack')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.config')
const { resolve, assetsPath } = require('./utils')

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: resolve('dist'),
    publicPath: '/',
    filename: assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: true
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  devtool: false
})
