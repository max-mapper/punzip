#!/usr/bin/env node
var minimist = require('minimist')
var punzip = require('./index.js')

require('epipebomb') // prevent EPIPE

var args = minimist(process.argv.slice(2))

var input = args._[0]

var entryNum = 1
if (args.entry) entryNum = +args.entry

var stream = punzip({input: input, entry: entryNum, list: args.list})

stream.on('error', function (err) {
  console.error('Unzip error', err)
  process.exit(1)
})

stream.pipe(process.stdout)

process.on('SIGINT', exitCleanly)

function exitCleanly () {
  if (!stream.cleanup) process.exit(1)
  stream.cleanup(function () {
    process.exit(1)
  })
}
