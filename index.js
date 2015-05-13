var yauzl = require("yauzl")
var fs = require("fs")
var path = require('path')
var mount = require('mount-url')
var duplexify = require('duplexify')
var through = require('through2')

module.exports = function (opts) {
  var duplex = duplexify()

  mount(opts.input, mounted)
  
  return duplex
  
  function mounted (err, cleanup) {
    if (err) return duplex.destroy(err)
    
    duplex.cleanup = cleanup
    var filename = path.basename(opts.input)
    var entryCount = 0
    var foundEntry = false
      
    if (opts.list) {
      var readable = through.obj()
      duplex.setReadable(readable)
      
      readable.on('finish', function () {
        cleanup()
      })
  
      readable.on('error', function (err) {
        cleanup()
      })
    }

    yauzl.open(filename, function(err, zipfile) {
      if (err) throw err
        
      zipfile.on("entry", function(entry) {
        if (opts.list) return readable.push(JSON.stringify(entry) + '\n')

        if (++entryCount === opts.entry) {
          foundEntry = true
          zipfile.openReadStream(entry, function(err, readStream) {
            if (err) {
              console.error('Error opening entry', err)
              cleanup(function () {
                process.exit(1)
              })
              return
            }

            duplex.setReadable(readStream)
        
            readStream.on('finish', function () {
              cleanup()
            })
        
            readStream.on('error', function (err) {
              cleanup()
            })
          })
        }
      })
      
      zipfile.on('end', function () {
        if (opts.list) return readable.end()
        if (!foundEntry) duplex.destroy(new Error('Entry not found in zip'))
      })
    })
  }
}
