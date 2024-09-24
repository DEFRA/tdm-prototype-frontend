import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
const logger = createLogger()
function mediumDateTime(dtString) {
  logger.info(`mediumDateTime : ${dtString}`)
  return new Date(dtString).toLocaleString('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/London'
  })
}

export { mediumDateTime }
