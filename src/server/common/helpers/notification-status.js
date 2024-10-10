import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { cleanPascalCase } from '~/src/server/common/helpers/string-cleaner.js'
const logger = createLogger()

function notificationCommodityMatchStatus(relationships, item) {
  const match = relationships.movements.data.find(
    (m) => m.sourceItem === item.complementID
  )
  // TODO : m.item is not coming through, use the index instead
  // const match = relationships.movements.data[index]
  logger.debug(
    `notificationCommodityMatchStatus : ${match || 'No match object'}`
  )
  const matched = match?.matched
  return {
    kind: 'tag',
    value: matched ? 'Matched' : 'No Match',
    classes: matched ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

function notificationMatchStatus(relationships) {
  logger.debug(
    `notificationMatchStatus : ${relationships ? relationships.movements : 'No Match'}`
  )
  const matched = relationships?.movements?.matched
  return {
    kind: 'tag',
    value: matched ? 'Matched' : 'No Match',
    classes: matched ? 'govuk-tag--green' : 'govuk-tag--red'
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
      text: cleanPascalCase(decisionText),
      classes:
        decision && decisionText.startsWith('Acceptable')
          ? 'govuk-tag--green'
          : 'govuk-tag--red'
    },
    acceptable: {
      text: acceptable ? 'Yes' : 'No',
      classes: [acceptable ? 'govuk-tag--green' : 'govuk-tag--red']
    }
  }
}

export {
  notificationPartTwoStatus,
  notificationCommodityMatchStatus,
  notificationMatchStatus
}
