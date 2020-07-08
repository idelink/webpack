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
