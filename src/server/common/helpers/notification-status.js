import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { cleanPascalCase } from '~/src/server/common/helpers/string-cleaner.js'
const logger = createLogger()

function notificationStatus(notification) {
  logger.debug(`notificationStatusNotification : ${notification.status}`)
  const statusMap = {
    _: 'govuk-tag--red',
    Validated: 'govuk-tag--green',
    Amend: 'govuk-tag--yellow',
    InProgress: 'govuk-tag--orange',
    Rejected: 'govuk-tag--red',
    Submitted: 'govuk-tag--blue',
    Draft: 'ovuk-tag--grey',
    Cancelled: 'ovuk-tag--black'
  }
  const statusKey = notification.status in statusMap ? notification.status : '_'

  const colour = statusMap[statusKey]

  return {
    text: cleanPascalCase(notification.status),
    classes: colour
  }
}
function notificationStatusTag(notification) {
  const status = notificationStatus(notification)

  return {
    kind: 'tag',
    value: status.text,
    classes: status.classes
  }
}

function notificationCheckStatus(check) {
  const statusMap = {
    _: 'govuk-tag--red',
    AutoCleared: 'govuk-tag--green',
    Compliant: 'govuk-tag--green',
    NonCompliant: 'govuk-tag--red',
    ToDo: 'govuk-tag--orange'
  }
  const statusKey = check.status in statusMap ? check.status : '_'

  const colour = statusMap[statusKey]

  return {
    kind: 'tag',
    value: cleanPascalCase(check.status),
    classes: colour
  }
}

function booleanTag(status) {
  return {
    kind: 'tag',
    value: status === null ? 'Unknown' : status ? 'Yes' : 'No',
    classes: status ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

function notificationCommodityMatchStatus(notification, item) {
  const match = notification.movements?.find(
    (m) => m.meta.sourceItem === item.complementID
  )
  // TODO : m.item is not coming through, use the index instead
  // const match = relationships.movements.data[index]
  logger.debug(
    `notificationCommodityMatchStatus : ${match || 'No match object'}`
  )
  const matched = match?.meta.matched
  return {
    kind: 'tag',
    value: matched ? 'Matched' : 'No Match',
    classes: matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

function notificationMatchStatus(notification) {
  logger.debug(
    `notificationMatchStatus : ${notification.movements ? notification.movements : 'No Match'}`
  )

  const commoditiesWithMatches = notification.commodities.map((c) => {
    let match = false
    if (notification.movements) {
      match = notification.movements.find(
        (m) => m.meta.sourceItem === c.complementID
      )
    }
    c.match = match
    return c
  })

  const matched = commoditiesWithMatches.every((c) => c.match)

  return {
    kind: 'tag',
    value: matched ? 'Matched' : 'No Match',
    classes: matched ? 'govuk-tag--green' : 'govuk-tag--red',
    matched
  }
}

function notificationPartTwoStatus(notification) {
  logger.debug(`partTwoStatus : ${notification}`)

  const decisionText = notification?.partTwo?.decision
    ? notification.partTwo.decision.decision
    : null
  const acceptable = notification?.partTwo?.decision
    ? notification.partTwo.decision.consignmentAcceptable
    : false
  const decision = decisionText != null

  return {
    display: decision,
    decision: {
      text: decisionText ? cleanPascalCase(decisionText) : 'TBC',
      classes:
        // decision && decisionText.startsWith('Acceptable')
        acceptable ? 'govuk-tag--green' : 'govuk-tag--red'
    },
    acceptable: {
      text: acceptable ? 'Yes' : 'No',
      classes: [acceptable ? 'govuk-tag--green' : 'govuk-tag--red']
    }
  }
}

export {
  booleanTag,
  notificationStatus,
  notificationStatusTag,
  notificationPartTwoStatus,
  notificationCommodityMatchStatus,
  notificationMatchStatus,
  notificationCheckStatus
}
