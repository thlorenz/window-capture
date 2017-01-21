const { captureBounds, captureWindow } = require('./lib/capture')
const { EventEmitter } = require('events')
const getWindowTracker = require('window-tracker')

class WindowCapturer extends EventEmitter {
  constructor({ interval = 1000, appFilter, windowFilter, crop = null } = {}) {
    super()
    this._crop = crop
    this._initWindowTracker({ interval, appFilter, windowFilter })
  }

  start() {
    this._windowTracker.start()
  }

  stop() {
    this._windowTracker.stop()
  }

  _initWindowTracker({ interval, appFilter, windowFilter }) {
    this._windowTracker = getWindowTracker({ interval, appFilter, windowFilter })
      .on('error', err => this.emit('error', err))
      .on('info', windows => this._handleWindows(windows))
  }

  _handleWindows(windows) {
    for (let i = 0; i < windows.length; i++) {
      this._handleWindow(windows[i])
    }
  }

  _handleWindow(window) {
    if (typeof this._crop !== 'function') {
      return captureWindow(window.windowid, (err, pngBuffer) => this._handlePng(err, pngBuffer, window))
    }

    const bounds = this._crop(window.bounds, window)
    if (bounds == null) return

    captureBounds(bounds, (err, pngBuffer) => this._handlePng(err, pngBuffer, window))
  }

  _handlePng(err, png, window) {
    if (err) return this.emit('error', err)
    this.emit('png', png, window)
  }
}

/**
 * Returns a window capturer.
 *
 * @name windowCapturer
 * @function
 * @param {Object} opts specifies how/which windows should be tracked, @see
 * [thlorenz/window-tracker](https://github.com/thlorenz/window-tracker) and cropped
 * @param {Number} interval how often are windows queried
 * @param {RegExp} appFilter if supplied only windows whose owning app title matches this filter will be captured
 * @param {RegExp} windowilter if supplied only windows whose title matches this filter will be captured
 * @param {function} crop if supplied, only part of the window will be captured, otherwise the entire window
 *  `crop` is called with (bounds, window) bounds is { x, y, w, h } while window includes all metadata about the window
 *  if `crop` returns `null` no capture is made, otherwise the bounds that it returns are used for the capture
 * @return {WindowCapturer} instance of a window capturer
 */
exports = module.exports = function windowCapturer({ interval, appFilter, windowFilter, crop } = {}) {
  return new WindowCapturer({ interval, appFilter, windowFilter, crop })
}

// Provide direct access to these methods to be used
// without window tracking
exports.captureBounds = captureBounds
exports.captureWindow = captureWindow
