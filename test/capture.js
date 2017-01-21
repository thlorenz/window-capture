// eslint-disable-next-line no-unused-vars
const saveImage = require('./util/save-image')

// eslint-disable-next-line no-unused-vars
function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true))
}

if (require('os').platform() === 'darwin') {
const test = require('tape')
const { captureBounds, captureWindow } = require('../lib/capture')

test('\ncapture bounds', function(t) {
  captureBounds({ x: 1, y: 1, w: 100, h: 100 }, oncaptured)
  function oncaptured(err, buf) {
    t.iferror(err, 'does not error')
    t.ok(buf.byteLength > 8000, 'captures buffer')
    t.end()
  }
})

// Need to manually test window capture as we don't know what windows are open
// and such. Use the below to test and inspect the result manually. It is saved
// to test/output.
// Use thlorenz/window-tracker to obtain a window id.
const captureWindowId = null
if (captureWindowId != null) captureWindow(captureWindowId, oncaptured)
}

function oncaptured(err, buf) {
  if (err) return console.error(err)
  saveImage('captured-window', buf)
}
