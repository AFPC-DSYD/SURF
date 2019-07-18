'use strict'
const merge = require('webpack-merge')
const flaEnv = require('./fla.env')

module.exports = merge(flaEnv, {
  NODE_ENV: '"development"'
})
