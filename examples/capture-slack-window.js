const getWindowCapturer = require('../')

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
