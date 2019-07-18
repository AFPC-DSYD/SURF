'use strict'
const utils = require('./utils')
const config = require('../config')
const isFLA = process.env.NODE_ENV === 'fla'

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: isFLA
      ? config.build.productionSourceMap
      : config.dev.cssSourceMap,
    extract: isFLA
  }),
  transformToRequire: {
    video: 'src',
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
