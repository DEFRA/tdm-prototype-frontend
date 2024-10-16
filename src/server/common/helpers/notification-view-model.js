import { weight } from '~/src/server/common/helpers/weight.js'
import { inspectionStatusElementListItem } from '~/src/server/common/helpers/inspection-status.js'
import { notificationCommodityMatchStatus } from '~/src/server/common/helpers/notification-status.js'

function notificationViewModelItems(notification) {
  return notification.commodities.map((c) => [
    {
      kind: 'text',
      value: c.complementID
    },
    { kind: 'text', value: c.commodityID },
    { kind: 'text', value: c.commodityDescription },
    {
      kind: 'text',
      value: c.complementName
    },
    {
      kind: 'text',
      value: c.additionalData.numberAnimal
    },
    {
      kind: 'text',
      value: weight(c.additionalData.netWeight)
    },
    inspectionStatusElementListItem(c),
    notificationCommodityMatchStatus(notification.relationships, c)
  ])
}

export { notificationViewModelItems }
