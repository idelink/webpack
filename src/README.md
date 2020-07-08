
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
  mode： ‘development’，
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

本文已同步到个人博客网站, 地址:  [webpack配置详解](https://www.gogoing.site/articles/207e289c-ea3b-47bc-9e86-6ae3af83a7d4.html)
