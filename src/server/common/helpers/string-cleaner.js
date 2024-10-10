import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
const logger = createLogger()

function cleanPascalCase(s) {
  logger.debug(`cleanPascalCase : ${s}`)
  return s ? s.split(/(?=[A-Z])/).join(' ') : s
}

export { cleanPascalCase }
