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

export const notificationsv2Controller = {
  async handler(request, h) {
    const logger = createLogger()
    const chedType = request.query?.chedType || 'Cveda'

    logger.info(
      `Querying JSON API for ipaffsNotifications, chedType=${chedType}`
    )

    const { data } = await jsonApi.findAll('ipaffsNotifications', {
      sort: '-lastUpdated',
      filter: `equals(ipaffsType,'${chedType}')`,
      // 'page[size]':1,
      'fields[ipaffsNotifications]': 'lastUpdated,status,ipaffsType,partOne'
    })

    const notifications = map(data, (n) => [
      { kind: 'link', url: '123', value: n.id },
      { kind: 'text', value: n.status },
      { kind: 'text', value: new Date(n.lastUpdated).toLocaleString() },
      // {"kind":"text", "url":"123", "value": n.status},
      {
        kind: 'text',
        url: '123',
        value: n.partOne.commodities.numberOfPackages
      }
    ])

    return h.view('notifications-v2/index', {
      pageTitle: 'Notifications v2',
      heading: 'Notifications v2',
      tabs: [
        {
          isActive: chedType === 'Cveda',
          url: `/notifications-v2?chedType=Cveda`,
          label: 'CHEDA'
        },
        {
          isActive: chedType === 'Ced',
          url: `/notifications-v2?chedType=Ced`,
          label: 'CHEDD'
        },
        {
          isActive: chedType === 'Cvedp',
          url: `/notifications-v2?chedType=Cvedp`,
          label: 'CHEDP'
        },
        {
          isActive: chedType === 'Chedpp',
          url: `/notifications-v2?chedType=Chedpp`,
          label: 'CHEDPP'
        }
      ],
      displayTabs: true,
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Notifications v2'
        }
      ],
      notifications
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
