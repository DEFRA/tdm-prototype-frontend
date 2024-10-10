import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
const logger = createLogger()

function movementItemMatchStatus(relationships, item) {
  const match = relationships?.notifications.data.find(
    (m) => m.sourceItem === item.itemNumber
  )
  // TODO : m.item is not coming through, use the index instead
  // const match = relationships.notifications.data[index]

  logger.debug(`movementCommodityMatchStatus : ${match || 'No match object'}`)
  const matched = match?.matched
  return {
    kind: 'tag',
    value: matched ? 'Matched' : 'No Match',
    classes: matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

/**
 * @param {{ notifications: any; }} relationships
 */
function movementMatchStatus(relationships) {
  logger.debug(
    `movementMatchStatus : ${relationships ? relationships.notifications : 'No Match'}`
  )
  const matched = relationships?.notifications?.matched
  return {
    kind: 'tag',
    value: matched ? 'Matched' : 'No Match',
    classes: matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

export { movementItemMatchStatus, movementMatchStatus }
