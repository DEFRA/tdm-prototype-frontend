import { config } from '~/src/config/index.js'
// import { map } from 'lodash-es'
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
  lastUpdatedBy: {
    displayName: '',
    userId: ''
  },
  partOne: {
    commodities: {
      numberOfPackages: 0,
      countryOfOrigin: '',
      commodityComplement: [
        {
          commodityID: '',
          commodityDescription: '',
          complementName: ''
        }
      ]
    },
    consignor: {
      id: '',
      type: '',
      status: '',
      companyName: ''
    },
    personResponsible: {
      id: '',
      type: '',
      status: '',
      companyName: ''
    },
    importer: {
      id: '',
      type: '',
      status: '',
      companyName: ''
    }
  }
})

export const notificationController = {
  async handler(request, h) {
    const logger = createLogger()
    const chedId = request.params.id

    // Get filter details to include on breadcrumb
    const chedType = request.query?.chedType || 'Cveda'

    logger.info(
      `Querying JSON API for ipaffsNotification, chedId=${chedId}, chedType=${chedType}`
    )

    const { data } = await jsonApi.find('ipaffsNotifications', chedId, {
      'fields[ipaffsNotifications]':
        'lastUpdated,lastUpdatedBy,status,ipaffsType,partOne'
    })
    logger.info(`Result received, ${data.id}`)

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
        { kind: 'tag', value: 'No Match', classes: 'govuk-tag--red' }
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
          text: `Notification ${chedId}`
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
