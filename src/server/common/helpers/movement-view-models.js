// import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { weight } from '~/src/server/common/helpers/weight.js'
import {
  movementItemDecisionStatus,
  movementItemMatchStatus
} from '~/src/server/common/helpers/movement-status.js'

// const logger = createLogger()

function movementViewModelItems(movement) {
  return movement?.items.map((i) => [
    { kind: 'text', value: i.itemNumber },
    { kind: 'text', value: i.taricCommodityCode },
    {
      kind: 'text',
      value: i.goodsDescription
    },
    {
      kind: 'text',
      value: i.itemOriginCountryCode
    },
    {
      kind: 'text',
      value: weight(i.itemNetMass)
    },
    {
      kind: 'text',
      value: i.itemSupplementaryUnits > 0 ? i.itemSupplementaryUnits : ''
    },
    movementItemMatchStatus(movement.relationships, i),
    movementItemDecisionStatus(i)
  ])
}

export { movementViewModelItems }
