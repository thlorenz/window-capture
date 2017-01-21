// Right now only works on OSX, but could on other platforms as well, see:
//  https://github.com/uiureo/node-screencapture/blob/cdaf9522ed5063f54b3efd917bc19ab81118d9c1/lib/capture_exec.js
// Namely on Windows use: nircmdc.exe
//        on Linux use  : scrot

const tmpdir = require('os').tmpDir()
const uuid = require('shortid')
const path = require('path')
const fs = require('fs')
const { exec } = require('child_process')

function handlePng(pngPath, buf, cb) {
  function onunlink(err) {
    if (err) return cb(err)
    cb(null, buf)
  }
  fs.unlink(pngPath, onunlink)
}

function handleCapture(pngPath, cb) {
  function onread(err, buf) {
    if (err) return cb(err)
    handlePng(pngPath, buf, cb)
  }
  fs.readFile(pngPath, onread)
}

function genPngPath() {
  return path.join(tmpdir, `${uuid.generate()}.png`)
}

/**
 * Captures the specified bounds of the screen.
 *
 * @name captureBounds
 * @function
 * @param {Object} bounds { x, y, w, h }
 * @param {function} cb called back with (err, pngBuffer)
 */
exports.captureBounds = function captureBounds(bounds, cb) {
  const pngPath = genPngPath()
  const cmd = `screencapture -R '${bounds.x}, ${bounds.y}, ${bounds.w}, ${bounds.h}' ${pngPath}`

  function oncaptured(err) {
    if (err) return cb(err)
    handleCapture(pngPath, cb)
  }

  exec(cmd, oncaptured)
}

/**
 * Captures the entire specified window.
 *
 * @name captureWindow
 * @function
 * @param {Number} winid id of the window to be captured
 * @param {function} cb called back with (err, pngBuffer)
 */
exports.captureWindow = function captureWindow(winid, cb) {
  const pngPath = genPngPath()
  const cmd = `screencapture -o -l ${winid} ${pngPath}`

  function oncaptured(err) {
    if (err) return cb(err)
    handleCapture(pngPath, cb)
  }

  exec(cmd, oncaptured)
}
