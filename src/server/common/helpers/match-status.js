import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
const logger = createLogger()
function matchStatusElementListItem(matches) {
  logger.debug(
    `matchStatusElementListItem : ${matches ? matches[0].matched + ' / ' + matches[0].reference : 'No match object'}`
  )
  return {
    kind: 'tag',
    value: matches?.[0]?.matched ? 'Matched' : 'No Match',
    classes: matches?.[0]?.matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

function matchStatusNotification(matches, items) {
  logger.debug(
    `matchStatusNotification : ${matches ? matches[0].matched + ' / ' + matches[0].reference : `No match object, items ${items}`}`
  )
  return {
    kind: 'tag',
    value: matches[0]?.matched ? 'Matched' : 'No Match',
    classes: matches[0]?.matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

function matchStatusMovement(matches, items) {
  logger.debug(
    `matchStatusMovement : ${matches ? matches[0].matched + ' / ' + matches[0].reference : `No match object, items ${items}`}`
  )
  return {
    kind: 'tag',
    value: matches[0]?.matched ? 'Matched' : 'No Match',
    classes: matches[0]?.matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}
export {
  matchStatusElementListItem,
  matchStatusNotification,
  matchStatusMovement
}
