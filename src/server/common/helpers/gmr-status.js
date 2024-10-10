import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'
import { cleanPascalCase } from '~/src/server/common/helpers/string-cleaner.js'
const logger = createLogger()

function gmrStateItemList(gmr) {
  logger.debug(`gmrStateItemList : ${JSON.stringify(gmr)}`)
  const state = cleanPascalCase(gmr.state)
  return {
    kind: 'tag',
    value: state,
    classes: gmr.state === 'Embarked' ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

function gmrDeclarationStatus(declaration) {
  logger.debug(`gmrDeclarationStatus : ${JSON.stringify(declaration)}`)
  const state = cleanPascalCase(declaration.state)
  return {
    kind: 'tag',
    value: state,
    classes:
      declaration.state === 'Matched' ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

function gmrState(gmr) {
  logger.debug(`gmrState : ${JSON.stringify(gmr)}`)
  const state = cleanPascalCase(gmr.state)
  return {
    kind: 'tag',
    value: state,
    classes: gmr.state === 'Embarked' ? 'govuk-tag--green' : 'govuk-tag--red'
  }
}

function gmrExpectedDeparture(gmr) {
  logger.debug(`gmrExpectedDeparture : ${JSON.stringify(gmr)}`)

  return mediumDateTime(gmr.plannedCrossing.localDateTimeOfDeparture)
}

function gmrExpectedArrival(gmr) {
  logger.debug(`gmrExpectedArrival : ${JSON.stringify(gmr)}`)

  if (gmr.actualCrossing) {
    return mediumDateTime(gmr.actualCrossing.localDateTimeOfArrival) + ' (A)'
  } else if (gmr.checkedInCrossing) {
    return mediumDateTime(gmr.checkedInCrossing.localDateTimeOfArrival)
  } else if (gmr.plannedCrossing.localDateTimeOfDeparture) {
    return `${mediumDateTime(gmr.plannedCrossing.localDateTimeOfDeparture)} (D)`
  } else {
    return 'TBC'
  }
}
function gmrInspectionRequiredItemList(gmr) {
  logger.debug(`gmrInspectionRequiredItemList : ${JSON.stringify(gmr)}`)

  const inspectionRequired = gmr.inspectionRequired

  return {
    kind: 'tag',
    value: inspectionRequired ? 'Yes' : 'No',
    classes: inspectionRequired ? 'govuk-tag--red' : 'govuk-tag--green'
  }
}

function gmrMatchItemList(gmr) {
  logger.debug(`gmrMatchItemList : ${JSON.stringify(gmr)}`)

  return {
    kind: 'tag',
    value: 'No Match',
    classes: 'govuk-tag--red'
  }
}

export {
  gmrState,
  gmrStateItemList,
  gmrInspectionRequiredItemList,
  gmrMatchItemList,
  gmrExpectedDeparture,
  gmrExpectedArrival,
  gmrDeclarationStatus
}
