
## 基本配置
1. **mode**: webpack工作在那种模式下，并使用相应模式的内置优化，可选值为'none', 'development' , 'production'
2. **entry**: 打包入口文件, 值可以是字符串、数组、对象和函数，函数的返回值必须是可用的文件入口路径

3. **context**: context 是entry的上下文，即表示入口文件所处的目录的绝对路径

```js
const resolve = (...args) => {
  return path.resolve(__dirname, '..', ...args)
}

module.exports = {
  // 使用开发环境
  mode：'development'，
  // 当前文件路径
  context: '',
  entry: {
    // 当前文件的父文件夹下的src目录(默认使用src目录下的index.js)
    app: '../src'
  }
}
```
4. **output**: 定义webpack打包后的文件如何输出

```js
output: {
  // 输入目录
  path: resolve('dist'),
  // 资源的基础路径, 决定webpack引用资源时资源的完整路径(完整路径=publicPath + filename)。
  // 比如打包后的文件名为js/1.c0a92244ebbea7068c7e.js
  /*
    1. 相对路径, 即publicPath： './', 完整路径为: ./js/1.c0a92244ebbea7068c7e.js
    2. 绝对路径, 即publicPath： '/assets/', 完整路径为: /assets/js/1.c0a92244ebbea7068c7e.js
  */
  publicPath: '/',
  // 文件名, 根据entry中的配置生成对应的文件
  filename: assetsPath('js/[name].[chunkhash].js'),
  // 块名, 非入口(non-entry) chunk 文件的名称
  chunkFilename: assetsPath('js/[id].[chunkhash].js')
},
```
5. **resolve**: 配置模块如何解析, 一般常用`resolve.alias`和`resolve.extensions`

```js
resolve: {
  // 配置别名
  alias: {
    '@': resolve('src')
  },
  // 自动解析确定的扩展名
  // 如import xx from 'src/test', 会匹配文件test.js, test.jsx, test.json或test目录
  extensions: ['.js', '.jsx', 'json']
}
```
6. **module**: 根据rules和noParse配置来决定如何处理项目中的不同类型的文件

```js
module: {
  rules: [
    // 使用babel-loader处理js或jsx文件
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: 'babel-loader'
    },
    // loader和options是use: [{ loader: 'xx', options: {...} }]的简写
    {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      exclude: [resolve('src/assets/icons')],
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: assetsPath('images/[name].[hash:8].[ext]')
      }
    }
  ]
}
```
7. **plugins**: 用于以各种方式自定义 webpack 构建过程。以下是一些插件配置及其介绍

```js
plugins: [
  // 提供全局React, 这样在每个页面中就每次都使用`import React from 'react'`引入react
  new webpack.ProvidePlugin({
    React: 'react'
  }),
  // 每次构建前清空原来的dist目录
  new CleanWebpackPlugin(),
  // 将css提出到每个单独的文件中(只在生产环境下有效)
  isProd && new MiniCssExtractPlugin({
    filename: 'static/css/[name].[hash].css',
    chunkFilename: 'static/css/[id].[hash].css'
  }),
  // 将src/static下的文件及文件夹复制到output.path/static
  new CopyWebpackPlugin({
    patterns: [
      {
        from: resolve('src/static'),
        to: 'static'
      }
    ]
  }),
  // 生成html模板
  new HtmlWebpackPlugin({
    template: resolve('index.html'),
    filename: 'index.html',
    inject: true
  }),
].filter(Boolean)
```
8. **devtool**: 定义是否生成以及如何生成 source map
* 开发环境下，一般使用'eval-cheap-module-source-map'或'source map',不通类型的source map会影响构建和重新构建的速度。更多配置请见[webpack devtool](https://webpack.js.org/configuration/devtool/#devtool)
* 生常环境下，一般禁用source map来效防止代码泄漏

## 开发服务器

```js
devServer: {
  // 启用 webpack 的模块热替换
  hot: true,
  // 输出构建消息到浏览器控制台
  inline: true,
  // 打包进度输出到控制台
  progress: true,
  // 服务器开启GZIP压缩
  compress: true,
  // 服务器默认使用http, 如需使用https, 则将其设置为true即可
  // https: true
  // 应用程序可通过局域网内ip访问
  host: '0.0.0.0',
  // 端口号
  port: 8080,
  // 如果编译错误, 将全屏显示错误信息
  overlay: true,
  // 除了初始启动信息之外的任何内容都不会被打印到控制台
  quiet: true,
  // 资源的基础路径, 同output.publicPath
  publicPath: '/',
  // 告诉服务器从哪里提供内容, 只有在你想要提供静态文件时才需要
  contentBase: false,
  // 使用轮询获取文件更新信息
  watchOptions: {
    poll: true
  },
  // 路由使用history模式, 所有路径都将指向index.html
  historyApiFallback: true,
  // 提供在服务器内部在所有其他中间件之前执行自定义中间件
  before: app => {
    app.get(/^.+\.html$/g, (req, res) => {
      return res.redirect(req.url.replace(/(index)?\.html$/, ''))
    })
  },
  // 请求转发, 解决本地开发跨域问题
  proxy: [
    { 
      // 可通过context指定多个路径, 如context: ['/api', '/users']
      context: ['/api'],
      target: `http://localhost:3000`,
      pathRewrite: {
      },
      changeOrigin: true,
      secure: false
    }
  ]
}
```

## 搭建一个webpack4

### 创建package.json

创建一个空文件夹，然后进入文件夹内执行命令`yarn init -y`或`npm init -y`生成默认的package.json

```code
[vegan.qian@dell webpack4]$ yarn init -y
yarn init v1.22.4
warning The yes flag has been set. This will automatically answer yes to all questions, which may have security implications.
success Saved package.json
Done in 0.04s.
```

### 安装webpack依赖

```code
yarn add -D webpack webpack-cli
```

### 安装babel依赖

```code
yarn add -D @babel/cli @babel/core @babel/preset-env @babel/plugin-proposal-class-properties @babel/plugin-proposal-decorators @babel/plugin-transform-runtime
```
安装完成后，在项目根目录下创建`.babelrc`文件，并输入以下配置

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ],
    [
      "@babel/plugin-proposal-class-properties",
      {
        "loose": true
      }
    ],
    "@babel/plugin-transform-runtime"
  ]
}
```

### 创建项目结构

在项目中，创建如下目录结构
 
![目录结构](https://cloud.gogoing.site/files/2020-07-09/1fa721ef-2fa9-450c-8950-bbf103d4893d.png)

### 编写公共方法

* 在scripts目录下新建文件utils.js, 然后输入以下内容。这里的resolve函数用于解析以根目录为参考点的路径，assetsPath用于定义打包后的资源输出目录(默认为static目录)

```js
const path = require('path')

const resolve = (...args) => {
  return path.resolve(__dirname, '..', ...args)
}

const assetsPath = (...args) => {
  return path.posix.join('static', ...args)
}

module.exports = {
  resolve,
  assetsPath
}
```

### webpack 公共配置

* 在scripts目录下新建文件webpack.base.config.js
* 编写开发和生成环境下共用的配置代码

```js
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
```
* 安装配置中需要的依赖

```code
yarn add -D copy-webpack-plugin mini-css-extract-plugin clean-webpack-plugin babel-loader style-loader css-loader postcss-loader less-loader url-loader
```

### Postcss配置

在webpack.base.config.js中，我们使用到了postcss-loader来处理css文件，所以也需要对其进行配置

* 安装postcss插件 

```code
yarn add -D postcss-import postcss-url autoprefixer
```

* 在项目根目录下创建文件.postcssrc.js，并输入以下内容

```js
module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {}
  }
}
```

### webpack开发环境配置

* 在scripts目录下新建文件webpack.dev.config.js, 并写入以下配置

```js
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
```
* 安装配置中需要的依赖

```code
yarn add -D webpack-dev-server webpack-merge html-webpack-plugin friendly-errors-webpack-plugin
```

### 配置scripts

* 安装跨平台环境变量设置库cross-env, `yarn add -D cross-env`
* 在package.json中增加start脚本

```code
"scripts": {
  "start": "cross-env NODE_ENV=development webpack-dev-server --config scripts/webpack.dev.config.js"
}
```
* 运行命令`yarn run start`

```code
[vegan.qian@dell webpack4]$ yarn run start
yarn run v1.22.4
$ cross-env NODE_ENV=development webpack-dev-server --config scripts/webpack.dev.config.js
10% building 1/1 modules 0 active[HPM] Proxy created: [ '/api' ]  ->  http://localhost:3000
ℹ ｢wds｣: Project is running at http://0.0.0.0:8080/
ℹ ｢wds｣: webpack output is served from /
ℹ ｢wds｣: 404s will fallback to /index.html
98% after emitting

 DONE  Compiled successfully in 3016ms                               20:33:24 PM

 I  Client available on:
 I  http://localhost:8080
 I  http://127.0.0.1:8080
 I  http://192.168.1.10:8080
```
这样，一个简单的webpack开发环境就搭好了。

### webpack正式环境配置

* 在scripts目录下新建文件webpack.prod.config.js, 并写入以下配置

```js
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
```

* 在package.json中添加build脚本

```code
"scripts": {
  "start": "cross-env NODE_ENV=development webpack-dev-server --config scripts/webpack.dev.config.js",
  "build": "cross-env NODE_ENV=production webpack --inline --progress --config scripts/webpack.prod.config.js"
}
```
* 运行命令 `yarn run build`, 可以看到文件已经成功被打包到dist目录中

```code
[vegan.qian@dell webpack4]$ yarn run build
yarn run v1.22.4
$ cross-env NODE_ENV=production webpack --inline --progress --config scripts/webpack.prod.config.js
Hash: df058a216561223f9e59
Version: webpack 4.43.0
Time: 1158ms
Built at: 07/09/2020 8:49:43 PM
                                  Asset       Size  Chunks                         Chunk Names
                             index.html  332 bytes          [emitted]              
static/css/app.df058a216561223f9e59.css   77 bytes       0  [emitted] [immutable]  app
                    static/images/1.jpg   34.8 KiB          [emitted]              
  static/js/app.f8fff264ae5cd3f62371.js   3.38 KiB       0  [emitted] [immutable]  app
Entrypoint app = static/css/app.df058a216561223f9e59.css static/js/app.f8fff264ae5cd3f62371.js
[pLGG] ./src/styles/index.less 39 bytes {0} [built]
[tjUo] ./src/index.js 1.83 KiB {0} [built]
    + 9 hidden modules
Child HtmlWebpackCompiler:
     1 asset
    Entrypoint HtmlWebpackPlugin_0 = __child-HtmlWebpackPlugin_0
    [Q3Bv] ./node_modules/html-webpack-plugin/lib/loader.js!./index.html 469 bytes {0} [built]
Child mini-css-extract-plugin node_modules/css-loader/dist/cjs.js!node_modules/postcss-loader/src/index.js!node_modules/less-loader/dist/cjs.js!src/styles/index.less:
    Entrypoint mini-css-extract-plugin = *
    [ajKL] ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src!./node_modules/less-loader/dist/cjs.js!./src/styles/index.less 317 bytes {0} [built]
        + 1 hidden module
Done in 2.33s.
```

![打包后目录结构](https://cloud.gogoing.site/files/2020-07-09/b1b6ebfa-a825-44cb-81e9-d2225e6ac4bc.png)

这样，一个简单的webpack打开环境就已经配置完了。

---


本文已同步到个人博客网站, 地址:  [webpack配置详解](https://www.gogoing.site/articles/207e289c-ea3b-47bc-9e86-6ae3af83a7d4.html)

如果你觉得这篇文章对你有帮助以及你对前端有着浓厚的兴趣，欢迎关注微信公众号-<b>前端学堂</b>，更多精彩文章等着你！