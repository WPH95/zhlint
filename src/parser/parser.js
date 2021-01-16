'use strict'

var unherit = require('unherit')
var Chinese = require('./parse-chinese')

module.exports = parse
parse.Parser = Chinese

function parse() {
  this.Parser = unherit(Chinese)
}
