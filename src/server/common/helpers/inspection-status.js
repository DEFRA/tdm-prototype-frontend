import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { cleanPascalCase } from '~/src/server/common/helpers/string-cleaner.js'
const logger = createLogger()
function inspectionStatusElementListItem(commodity) {
  logger.debug(`inspectionStatusElementListItem : ${JSON.stringify(commodity)}`)
  const inspectionRequired = getRiskAssesment(commodity)

  // Required, Not Required, Inconclusive, Complete, Unknown

  return {
    kind: 'tag',
    value: cleanPascalCase(inspectionRequired),
    classes:
      inspectionRequired !== 'Complete' ? 'govuk-tag--red' : 'govuk-tag--green'
  }
}

function getRiskAssesment(commodity) {
  return commodity.riskAssesment?.riskDecision
    ? commodity.riskAssesment.riskDecision
    : 'Unknown'
}

function inspectionStatusNotification(notification) {
  logger.debug(`inspectionStatusNotification : ${notification}`)

  // Todo remove Notrequired when casing fixed
  const seniority = [
    'Unknown',
    'Inconclusive',
    'Required',
    'Notrequired',
    'NotRequired',
    'Complete'
  ]

  let lowestLabel = seniority[0]
  try {
    const riskAssessments =
      notification.partOne.commodities.commodityComplement.map((c) =>
        getRiskAssesment(c)
      )

    logger.debug(`riskAssessments : ${riskAssessments}`)

    const lowest =
      Math.min(...riskAssessments.map((r) => seniority.indexOf(r))) || 0
    lowestLabel = seniority[lowest]
    logger.debug(`lowest : ${lowest}, seniority : ${lowestLabel}`)
  } catch (e) {
    logger.error(`Error in inspectionStatusNotification ${e}`)
  }

  return {
    text: cleanPascalCase(lowestLabel),
    classes: lowestLabel === 'Complete' ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

export { inspectionStatusElementListItem, inspectionStatusNotification }
