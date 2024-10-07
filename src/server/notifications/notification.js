/**
 * A GDS styled example notifications page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import {
  matchStatusElementListItem,
  matchStatusNotification
} from '~/src/server/common/helpers/match-status.js'

import { getClient } from '~/src/server/common/models.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'
import { weight } from '~/src/server/common/helpers/weight.js'

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
    const { data } = await client.find('notifications', chedId, {
      'fields[notifications]':
        'movements,lastUpdated,lastUpdatedBy,status,ipaffsType,partOne,auditEntries'
    })
    logger.info(`Result received, ${data.id}`)
    // logger.info(data)
    // logger.info(data.movement)
    // logger.info(data.movement.matched)

    try {
      const ipaffsCommodities =
        data.partOne.commodities.commodityComplement.map((c) => [
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
          matchStatusElementListItem(data.movements)
        ])

      // logger.info(Object.keys(data))
      // const auditEntries = [];
      const auditEntries = data.auditEntries
        ? data.auditEntries.map((i) => [
            { kind: 'text', value: i.version },
            { kind: 'text', value: i.createdBy },
            { kind: 'text', value: mediumDateTime(i.createdSource) },
            { kind: 'text', value: mediumDateTime(i.createdLocal) },
            { kind: 'text', value: i.status }
          ])
        : []

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
        notification: data,
        lastUpdated: mediumDateTime(data.lastUpdated),
        ipaffsCommodities,
        auditEntries,
        matchOutcome: matchStatusNotification(
          data.movements,
          data.partOne.commodities.commodityComplement
        )
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
