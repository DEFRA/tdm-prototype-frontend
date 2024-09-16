import { config } from '~/src/config/index.js'
import { map } from 'lodash-es'
/**
 * A GDS styled example notifications page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
// import { proxyFetch } from '~/src/server/common/helpers/proxy-fetch'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

import JsonApi from 'devour-client'

const jsonApi = new JsonApi({ apiUrl: config.get('tdmBackendApi') })

// Define Model
jsonApi.define('ipaffsNotification', {
  version: '',
  status: '',
  notificationType: '',
  ipaffsType: '',
  lastUpdated: '',
  partOne: {
    commodities: {
      numberOfPackages: 0
    }
  }
})

export const notificationsController = {
  async handler(request, h) {
    const logger = createLogger()

    const { data } = await jsonApi.findAll('ipaffsNotifications', {
      sort: '-lastUpdated',
      // 'page[size]':1,
      'fields[ipaffsNotifications]': 'lastUpdated,status,ipaffsType,partOne'
    })
    logger.info(data[0])
    const notifications = map(data, (n) => [
      {
        text: n.id
      },
      {
        text: n.status
      },
      {
        text: n.ipaffsType
      },
      {
        text: n.lastUpdated
      },
      {
        text: n.partOne.commodities.numberOfPackages,
        format: 'numeric',
        attributes: {
          'data-sort-value': '1897'
        }
      }
    ])

    return h.view('notifications/index', {
      pageTitle: 'Notifications',
      heading: 'Notifications',
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Notifications'
        }
      ],
      notifications
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
