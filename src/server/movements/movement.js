import { config } from '~/src/config/index.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { matchStatusElementListItem } from '~/src/server/common/helpers/match-status.js'

import { jsonApi } from '~/src/server/common/models.js'

export const movementController = {
  async handler(request, h) {
    const logger = createLogger()
    const movementId = request.params.id

    // Get filter details to include on breadcrumb
    // const chedType = request.query?.chedType || 'Cveda'

    try {
      logger.info(`Querying JSON API for movement, movementId=${movementId}`)

      const { data } = await jsonApi.find('movements', movementId, {
        // 'fields[ipaffsNotifications]':
        //   'lastUpdated,lastUpdatedBy,status,ipaffsType,partOne'
      })
      logger.info(`Result received, ${data.id}`)

      const items = data.items.map((i) => [
        { kind: 'text', value: i.CustomsProcedureCode },
        { kind: 'text', value: i.TaricCommodityCode },
        {
          kind: 'text',
          value: i.GoodsDescription
        },
        {
          kind: 'text',
          value: i.ItemOriginCountryCode
        },
        {
          kind: 'text',
          value: i.ItemNetMass
        },
        matchStatusElementListItem(i.notifification)
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
        lastUpdated: new Date(data.lastUpdated).toLocaleString(),
        items
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
