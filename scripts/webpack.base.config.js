const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { resolve, assetsPath } = require('./utils')
const isProd = Object.is(process.env.NODE_ENV, 'production')

module.exports = {
  context: resolve(''),
  entry: {
    app: resolve('src')
  },
  resolve: {
    alias: {
      '@': resolve('src')
    },
    extensions: ['.js', '.jsx', 'json']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          isProd ? {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: !isProd
            }
          } : 'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader'
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('images/[name].[hash:8].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    isProd && new MiniCssExtractPlugin({
      filename: `static/css/[name]${isProd ? '.[hash]' : ''}.css`,
      chunkFilename: `static/css/[id]${isProd ? '.[hash]' : ''}.css`
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve('src/static'),
          to: 'static'
        }
      ]
    })
  ].filter(Boolean),
  devtool: 'source-map'
}
