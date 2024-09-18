import { config } from '~/src/config/index.js'
// import { map } from 'lodash-es'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
// import { appTag } from 'cdp-portal-frontend/src/server/common/components/tag'
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

export const notificationsListController = {
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

    const notifications = data.map(
      (
        /** @type {{ id: any; status: any; lastUpdated: string | number | Date; partOne: { commodities: { numberOfPackages: any; }; }; }} */ n
      ) => [
        {
          kind: 'link',
          url: `/notification/${n.id}?chedType=${chedType}`,
          value: n.id
        },
        { kind: 'text', value: n.status },
        { kind: 'text', value: new Date(n.lastUpdated).toLocaleString() },
        {
          kind: 'text',
          value: n.partOne.commodities.numberOfPackages
        },
        { kind: 'tag', value: 'No Match', classes: 'govuk-tag--red' }
      ]
    )

    return h.view('notifications/list', {
      pageTitle: 'Notifications',
      heading: 'Notifications',
      tabs: [
        {
          isActive: chedType === 'Cveda',
          url: `/notifications?chedType=Cveda`,
          label: 'CHEDA'
        },
        {
          isActive: chedType === 'Ced',
          url: `/notifications?chedType=Ced`,
          label: 'CHEDD'
        },
        {
          isActive: chedType === 'Cvedp',
          url: `/notifications?chedType=Cvedp`,
          label: 'CHEDP'
        },
        {
          isActive: chedType === 'Chedpp',
          url: `/notifications?chedType=Chedpp`,
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
          text: 'Notifications'
        }
      ],
      // data,
      notifications,
      chedType
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
