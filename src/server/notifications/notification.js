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

import { movementItemCheckDecisionStatus } from '~/src/server/common/helpers/movement-status.js'

import { getClient } from '~/src/server/common/models.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'
import { weight } from '~/src/server/common/helpers/weight.js'
import {
  inspectionStatusElementListItem,
  inspectionStatusNotification
} from '~/src/server/common/helpers/inspection-status.js'

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

    let checks = []

    if (notification.relationships.movements.matched) {
      logger.info(
        `Notification matched, ${notification.relationships.movements}`
      )
      const movementIds = new Set(
        notification.relationships.movements.data.map((m) => m.id)
      )

      // Get movement(s)
      const movements = await Promise.all(
        Array.from(movementIds).map(async (id) => {
          const { data: m } = await client.find('movements', id, {
            // 'fields[notifications]':
            //   'movements,lastUpdated,lastUpdatedBy,status,ipaffsType,partOne,auditEntries'
          })

          return m
        })
      )
      // [m.id, i.itemNumber, i.checks]
      checks = movements
        .map((m) =>
          m.items.map((i) =>
            i.checks.map((c) => {
              return { ...c, movement: m.id, item: i.itemNumber }
            })
          )
        )
        .flat(2)
    }

    checks = checks.map((c) => [
      { kind: 'text', value: c.item },
      { kind: 'text', value: c.checkCode },
      { kind: 'text', value: c.documentCode },
      { kind: 'text', value: c.departmentCode },
      movementItemCheckDecisionStatus(c)
    ])

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
            {
              kind: 'text',
              value: i.createdBy,
              itemClasses: ['tdm-text-truncate']
            },
            { kind: 'text', value: mediumDateTime(i.createdSource) },
            { kind: 'text', value: mediumDateTime(i.createdLocal) },
            { kind: 'text', value: i.status }
          ])
        : []

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
        notification,
        lastUpdated: mediumDateTime(notification.lastUpdated),
        ipaffsCommodities,
        commodityTabItems,
        auditEntries,
        inspectionStatus,
        partTwoStatus,
        checks,
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
