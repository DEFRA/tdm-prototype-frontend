import { config } from '~/src/config/index.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { matchStatusElementListItem } from '~/src/server/common/helpers/match-status.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'
import { weight } from '~/src/server/common/helpers/weight.js'

import { getClient } from '~/src/server/common/models.js'

export const movementController = {
  async handler(request, h) {
    const logger = createLogger()
    const movementId = request.params.id

    // Get filter details to include on breadcrumb
    // const chedType = request.query?.chedType || 'Cveda'

    try {
      logger.info(`Querying JSON API for movement, movementId=${movementId}`)
      const client = await getClient(request)
      const { data } = await client.find('movements', movementId, {
        // 'fields[ipaffsNotifications]':
        //   'lastUpdated,lastUpdatedBy,status,ipaffsType,partOne'
      })
      logger.info(`Result received, ${data.id}`)

      const items = data.items.map((i) => [
        { kind: 'text', value: i.customsProcedureCode },
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
        matchStatusElementListItem(i.notifification)
      ])

      const auditEntries = data.auditEntries.map((i) => [
        { kind: 'text', value: i.version },
        { kind: 'text', value: i.createdBy },
        { kind: 'text', value: mediumDateTime(i.createdSource) },
        { kind: 'text', value: mediumDateTime(i.createdLocal) },
        { kind: 'text', value: i.status }
      ])

      return h.view('movements/movement', {
        pageTitle: `Movement ${movementId}`,
        heading: `Movement ${movementId}`,
        breadcrumbs: [
          {
            text: 'Home',
            href: '/'
          },
          {
            text: 'Movements',
            href: `/movements`
          },
          {
            text: `Movement ${movementId}`,
            href: `${config.get('tdmBackendApi')}/movements/${movementId}`
          }
        ],
        notification: data,
        lastUpdated: mediumDateTime(data.lastUpdated),
        items,
        auditEntries
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
