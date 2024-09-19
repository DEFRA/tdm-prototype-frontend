import { config } from '~/src/config/index.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
// import { matchStatusElementListItem } from '~/src/server/notifications/helpers/match-status.js'

import { jsonApi } from '~/src/server/common/models.js'

export const movementController = {
  async handler(request, h) {
    const logger = createLogger()
    const movementId = request.params.id

    // Get filter details to include on breadcrumb
    // const chedType = request.query?.chedType || 'Cveda'

    logger.info(`Querying JSON API for movement, movementId=${movementId}`)

    const { data } = await jsonApi.find('movements', movementId, {
      // 'fields[ipaffsNotifications]':
      //   'lastUpdated,lastUpdatedBy,status,ipaffsType,partOne'
    })
    logger.info(`Result received, ${data.id}`)

    // const ipaffsCommodities = data.partOne.commodities.commodityComplement.map(
    //   (c) => [
    //     { kind: 'text', value: c.commodityID },
    //     { kind: 'text', value: c.commodityDescription },
    //     {
    //       kind: 'text',
    //       value: c.complementName
    //     },
    //     {
    //       kind: 'text',
    //       value: 0
    //     },
    //     {
    //       kind: 'text',
    //       value: 0
    //     },
    //     {
    //       kind: 'text',
    //       value: 0
    //     },
    //     matchStatusElementListItem(data)
    //   ]
    // )

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
      lastUpdated: new Date(data.lastUpdated).toLocaleString()
      // ipaffsCommodities
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
