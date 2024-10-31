import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
const logger = createLogger()

function movementItemMatchStatus(movement, item) {
  const match = movement?.notifications.find(
    (m) => m.meta.sourceItem === item.itemNumber
  )
  // TODO : m.item is not coming through, use the index instead
  // const match = relationships.notifications.data[index]

  logger.debug(`movementCommodityMatchStatus : ${match || 'No match object'}`)
  const matched = match?.meta.matched
  return {
    kind: 'tag',
    value: matched ? 'Matched' : 'No Match',
    classes: matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

function movementMatchStatus(movement) {
  logger.debug(
    `movementMatchStatus : ${movement ? movement.notifications : 'No Match'}`
  )

  // movement.items

  const matched = movement?.notifications?.every((n) => n.meta.matched)
  return {
    kind: 'tag',
    value: matched ? 'Matched' : 'No Match',
    classes: matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

function movementDecisionStatus(movement) {
  const checks = movementGetChecks(movement)
  return movementDecisionStatusFromChecks(checks)
}

function movementDecisionStatusFromChecks(checks) {
  logger.debug(`movementDecisionStatus : ${checks}`)

  // We want the 'worst' decision from all the items on the document
  const lowest =
    checks && checks.length > 0
      ? Math.min(...checks.map((c) => c[1].decisionIndex))
      : 0
  const statusItem = Object.values(statusMap)[lowest]

  return {
    kind: 'tag',
    value: statusItem[0],
    classes: statusItem[1]
  }
}

function movementItemDecisionStatus(item) {
  // TODO : at the moment we only expect one check per item
  // may not be correct
  logger.debug(`movementItemDecisionStatus : ${item}`)
  return movementItemCheckDecisionStatus(item?.checks ? item?.checks[0] : {})
}

function movementGetChecks(movement) {
  return movement?.items
    .map((i) => (i.checks ? i.checks.map((c) => [i, c]) : []))
    .flat()
    .map((i) => movementItemCheckAddStatus(i[0], i[1]))
}

const statusMap = {
  _: ['TBC', 'govuk-tag--red'], // if we don't have a match, use this,
  W: ['Waiting', 'govuk-tag--red'],
  N: ['Refusal', 'govuk-tag--red'],
  H: ['Hold', 'govuk-tag--yellow'],
  X: ['No Match', 'govuk-tag--yellow'],
  E: ['Data Error', 'govuk-tag--yellow'],
  C: ['Release', 'govuk-tag--green']
}

function _movementItemCheckAddStatus(check) {
  let decisionMessage = null

  let firstChar = check.decisionCode?.substring(0, 1)

  if (!firstChar) {
    firstChar = 'W'
  } else if (!(firstChar in statusMap)) {
    firstChar = '_'
  }

  ;[decisionMessage, check.displayClass] = statusMap[firstChar]

  check.decisionMessage = decisionMessage
  check.decisionChar = firstChar
  check.decisionIndex = Object.keys(statusMap).indexOf(firstChar)

  return check
}

function movementItemCheckAddStatus(item, check) {
  check = _movementItemCheckAddStatus(check)

  return [item, check]
}

function movementItemCheckDecisionStatus(check) {
  logger.debug(`movementItemCheckDecisionStatus : ${check}`)

  check = _movementItemCheckAddStatus(check)

  return {
    kind: 'tag',
    value: check.decisionMessage,
    classes: check.displayClass
  }
}

export {
  movementDecisionStatus,
  movementDecisionStatusFromChecks,
  movementItemMatchStatus,
  movementMatchStatus,
  movementItemDecisionStatus,
  movementItemCheckDecisionStatus,
  movementGetChecks
}
