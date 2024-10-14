/**
 * A GDS styled example notifications page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import {
  notificationCommodityMatchStatus,
  notificationMatchStatus,
  notificationPartTwoStatus
} from '~/src/server/common/helpers/notification-status.js'

import { getClient } from '~/src/server/common/models.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'
import { weight } from '~/src/server/common/helpers/weight.js'
import {
  inspectionStatusElementListItem,
  inspectionStatusNotification
} from '~/src/server/common/helpers/inspection-status.js'
import {movementItemCheckDecisionStatus} from "~/src/server/common/helpers/movement-status.js";

export const notificationController = {
  async handler(request, h) {
    const logger = createLogger()
    const chedId = request.params.id

    // Get filter details to include on breadcrumb
    const chedType = request.query?.chedType || 'Cveda'

    logger.info(
      `Querying JSON API for notification, chedId=${chedId}, chedType=${chedType}`
    )

    const client = await getClient(request)
    const { data: notification } = await client.find('notifications', chedId, {
      // 'fields[notifications]':
      //   'movements,lastUpdated,lastUpdatedBy,status,ipaffsType,partOne,auditEntries'
    })
    logger.info(`Result received, ${notification.id}`)

    try {
      const ipaffsCommodities =
        notification.partOne.commodities.commodityComplement.map((c) => [
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

      // logger.info(Object.keys(data))
      // const auditEntries = [];
      const auditEntries = notification.auditEntries
        ? notification.auditEntries.map((i) => [
            { kind: 'text', value: i.version },
            { kind: 'text', value: i.createdBy },
            { kind: 'text', value: mediumDateTime(i.createdSource) },
            { kind: 'text', value: mediumDateTime(i.createdLocal) },
            { kind: 'text', value: i.status }
          ])
        : []

      // const checks = notification?.partOne.commodities.commodityComplement
      //   .map((c) => i.checks.map((c) => [i, c]))
      //   .flat()
      //   .map(([i, c]) => [
      //     { kind: 'text', value: i.itemNumber },
      //     { kind: 'text', value: c.checkCode },
      //     { kind: 'text', value: c.decisionCode },
      //     { kind: 'text', value: c.departmentCode },
      //     movementItemCheckDecisionStatus(c)
      //   ])

      const commodityTabItems =
        notification.partOne.commodities.commodityComplement.reduce(
          (memo, c) => {
            // memo.fragments[c.commodityID] = c
            memo.tabItems.push({
              label: `${c.complementID}: ${c.commodityID}`,
              id: `${c.complementID}-${c.commodityID}`,
              panel: {
                html: `<h2 class="govuk-heading-l">${c.complementID}: ${c.commodityID}</h2><div>TODO : Commodity match movement information</div>`
              }
            })
            return memo
          },
          { fragments: [], tabItems: [] }
        )

      const inspectionStatus = inspectionStatusNotification(notification)
      const partTwoStatus = notificationPartTwoStatus(notification)

      return h.view('notifications/notification', {
        pageTitle: `Notification ${chedId}`,
        heading: `Notification ${chedId}`,
        breadcrumbs: [
          {
            text: 'Home',
            href: '/'
          },
          {
            text: 'Notifications',
            href: `/notifications?chedType=${chedType}`
          },
          {
            text: `Notification ${chedId}`,
            href: `/auth/proxy/api/notifications/${chedId}`
          }
        ],
        notification: notification,
        lastUpdated: mediumDateTime(notification.lastUpdated),
        ipaffsCommodities,
        commodityTabItems,
        auditEntries,
        inspectionStatus,
        partTwoStatus,
        matchOutcome: notificationMatchStatus(notification.relationships)
      })
    } catch (e) {
      logger.error(e)
      throw e
    }
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
