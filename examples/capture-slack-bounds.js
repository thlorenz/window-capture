const getWindowCapturer = require('../')

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
