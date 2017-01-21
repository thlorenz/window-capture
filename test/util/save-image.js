const path = require('path')
const fs = require('fs')

module.exports = function saveImage(name, img) {
  const p = path.join(__dirname, '..', 'output', name + '.png')
  fs.writeFileSync(p, img)
}
