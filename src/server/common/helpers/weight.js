import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
const logger = createLogger()
function weight(w) {
  logger.info(`weight : ${w}`)
  var unit = 'kg'
  if (!w) {
    return ''
  }
  if (w > 1000) {
    unit = 'tonne'
    w = w / 1000
  }
  return `${w.toLocaleString()} ${unit}`
}

export { weight }
