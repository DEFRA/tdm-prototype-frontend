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

function movementItemDecisionStatus(item) {
  logger.debug(`movementItemDecisionStatus : ${item}`)
  return movementItemCheckDecisionStatus(item?.checks[0])
}

function movementItemCheckDecisionStatus(check) {
  logger.debug(`movementItemCheckDecisionStatus : ${check}`)

  const statusMap = {
    _: ['TBC', 'govuk-tag--red'], // if we don't have a match, use this
    N: ['Refusal', 'govuk-tag--red'],
    H: ['Hold', 'govuk-tag--yellow'],
    X: ['No Match', 'govuk-tag--yellow'],
    E: ['Data Error', 'govuk-tag--yellow'],
    C: ['Release', 'govuk-tag--green']
  }
  let decisionMessage = null
  let displayClass = null

  let firstChar = check.decisionCode?.substring(0, 1)

  if (!firstChar) {
    decisionMessage = 'Waiting'
    firstChar = '_'
  } else if (!(firstChar in statusMap)) {
    firstChar = '_'
  }

  ;[decisionMessage, displayClass] = statusMap[firstChar]

  return {
    kind: 'tag',
    value: decisionMessage,
    classes: displayClass
  }
}

export {
  movementItemMatchStatus,
  movementMatchStatus,
  movementItemDecisionStatus,
  movementItemCheckDecisionStatus
}
