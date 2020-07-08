const webpack = require('webpack')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ifaces = require('os').networkInterfaces()
const baseWebpackConfig = require('./webpack.base.config')
const { resolve } = require('./utils')

const port = 8080

const ips = Object
  .keys(ifaces)
  .reduce((result, id) => result.concat(ifaces[id].filter(item => item.family === 'IPv4')), [])
  .reduce((result, { address }) => {
    if (!result.includes(address)) {
      result.push(address)
    }

    return result
  }, ['localhost'])

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    path: resolve('dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  devServer: {
    hot: true,
    inline: true,
    progress: true,
    compress: true,
    host: '0.0.0.0',
    port: port,
    quiet: true,
    overlay: true,
    publicPath: '/',
    contentBase: false,
    watchOptions: {
      poll: true
    },
    historyApiFallback: true,
    before: app => {
      app.get(/^.+\.html$/g, (req, res) => {
        return res.redirect(req.url.replace(/(index)?\.html$/, ''))
      })
    },
    proxy: [
      {
        context: ['/api'],
        target: `http://localhost:3000`,
        pathRewrite: {
        },
        changeOrigin: true,
        secure: false
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: resolve('index.html'),
      filename: 'index.html',
      inject: true
    }),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          'Client available on:',
          ...ips.map(ip => `http://${ip}:${port}`)
        ]
      },
      onErrors: null
    })
  ]
})
