import { config } from '~/src/config/index.js'
// import { map } from 'lodash-es'
/**
 * A GDS styled example notifications page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
// import { proxyFetch } from '~/src/server/common/helpers/proxy-fetch'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { matchStatusElementListItem } from '~/src/server/notifications/helpers/match-status.js'

import { jsonApi } from '~/src/server/common/models.js'

export const notificationController = {
  async handler(request, h) {
    const logger = createLogger()
    const chedId = request.params.id

    // Get filter details to include on breadcrumb
    const chedType = request.query?.chedType || 'Cveda'

    logger.info(
      `Querying JSON API for notification, chedId=${chedId}, chedType=${chedType}`
    )

    const { data } = await jsonApi.find('notifications', chedId, {
      'fields[notifications]':
        'lastUpdated,lastUpdatedBy,status,ipaffsType,partOne'
    })
    logger.info(`Result received, ${data.id}`)
    logger.info(data.movement)
    const ipaffsCommodities = data.partOne.commodities.commodityComplement.map(
      (c) => [
        { kind: 'text', value: c.commodityID },
        { kind: 'text', value: c.commodityDescription },
        {
          kind: 'text',
          value: c.complementName
        },
        {
          kind: 'text',
          value: 0
        },
        {
          kind: 'text',
          value: 0
        },
        {
          kind: 'text',
          value: 0
        },
        matchStatusElementListItem(data)
      ]
    )

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
          href: `${config.get('tdmBackendApi')}/notifications/${chedId}`
        }
      ],
      notification: data,
      lastUpdated: new Date(data.lastUpdated).toLocaleString(),
      ipaffsCommodities
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
