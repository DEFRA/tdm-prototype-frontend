import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
const logger = createLogger()
function inspectionStatusElementListItem(commodity) {
  logger.debug(`inspectionStatusElementListItem : ${JSON.stringify(commodity)}`)
  const inspectionRequired = commodity

  return {
    kind: 'tag',
    value: commodity.riskAssesment.riskDecision,
    classes: inspectionRequired ? 'govuk-tag--red' : 'govuk-tag--green'
  }
}

function inspectionStatusNotification(notification) {
  logger.debug(`inspectionStatusNotification : ${notification}`)
  const inspectionRequired = notification

  return {
    kind: 'tag',
    value: inspectionRequired ? 'Required' : 'Not Required',
    classes: inspectionRequired ? 'govuk-tag--red' : 'govuk-tag--green'
  }
}

export { inspectionStatusElementListItem, inspectionStatusNotification }
