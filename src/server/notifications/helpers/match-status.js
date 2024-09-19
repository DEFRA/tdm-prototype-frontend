import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
const logger = createLogger()
function matchStatusElementListItem(match) {
  logger.info(
    `matchStatusElementListItem : ${match.matched}, ${match.reference}`
  )
  return {
    kind: 'tag',
    value: match.matched ? 'Matched' : 'No Match',
    classes: match.matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

export { matchStatusElementListItem }
