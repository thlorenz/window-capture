# window-capture

Captures parts of application windows at an interval as a png image.

## Capturing entire Slack Window

```js
const getWindowCapturer = require('window-capturer')

let id = 0
const saveImage = require('../test/util/save-image')
const appFilter = /Slack/
const capturer = getWindowCapturer({ interval: 1000, appFilter })
capturer
  .on('error', console.error)
  .on('png', png => {
    saveImage('slack-' + (id++), png)
    if (id > 10) capturer.stop()
  })
  .start()
```

## Capturing part of Slack Window

```js
const getWindowCapturer = require('window-capturer')

function crop(bounds) {
  // crop upper left third with margin
  const x = bounds.x + 10
  const y = bounds.y + 5
  const w = bounds.w / 3
  const h = bounds.h / 3
  return { x, y, w, h }
}

let id = 0
const saveImage = require('../test/util/save-image')
const appFilter = /Slack/
const capturer = getWindowCapturer({ interval: 1000, appFilter, crop })
capturer
  .on('error', console.error)
  .on('png', png => {
    saveImage('slackpartial-' + (id++), png)
    if (id > 10) capturer.stop()
  })
  .start()
```

## Installation

    npm install window-capture

## API

### `window-capture`

Returns an instance of a `WindowCapturer`.
 
#### arguments

 - @param {Object} opts specifies how/which windows should be tracked, @see
 [thlorenz/window-tracker](https://github.com/thlorenz/window-tracker) and cropped
  - @param {Number} interval how often are windows queried
  -  @param {RegExp} appFilter if supplied only windows whose owning app title matches this filter will be captured
  -  @param {RegExp} windowilter if supplied only windows whose title matches this filter will be captured
  -  @param {function} crop if supplied, only part of the window will be captured, otherwise the entire window
      - `crop` is called with (bounds, window) 
      - bounds is { x, y, w, h }
      - window includes all metadata about the window
      - if `crop` returns `null` no capture is made, otherwise the bounds that it returns are used for the capture
 
### `WindowCapturer#start()`

Starts capturing windows.

### `WindowCapturer#stop()`

Stops capturing windows.

### Lower level capture API

#### `windowCapturer.captureBounds`

Captures the specified bounds of the screen.

##### arguments

- @name captureBounds
- @param {Object} bounds { x, y, w, h }
- @param {function} cb called back with (err, pngBuffer)

#### `windowCapturer.captureWindow`

Captures the entire specified window.
 
##### arguments

- @name captureWindow
- @param {Number} winid id of the window to be captured
- @param {function} cb called back with (err, pngBuffer)

## License

MIT
