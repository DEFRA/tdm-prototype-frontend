import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
// import { appTag } from 'cdp-portal-frontend/src/server/common/components/tag'

import { getClient } from '~/src/server/common/models.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'
import { matchStatusNotification } from '~/src/server/common/helpers/match-status.js'

export const notificationsListController = {
  async handler(request, h) {
    const logger = createLogger()
    const chedType = request.query?.chedType || 'Cveda'

    logger.info(`Querying JSON API for notifications, chedType=${chedType}`)
    const client = await getClient(request)
    const { data } = await client.findAll('notifications', {
      sort: '-lastUpdated',
      filter: `equals(ipaffsType,'${chedType}')`,
      // 'page[size]':1,
      'fields[notifications]': 'movements,lastUpdated,status,ipaffsType,partOne'
    })

    const notifications = data.map(
      (
        /** @type {{ id: any; movements: any, status: any; lastUpdated: string | number | Date; partOne: { commodities: { numberOfPackages: any; }; arrivalDate: any, arrivalTime: any, pointOfEntry:any }; }} */ n
      ) => [
        {
          kind: 'link',
          url: `/notifications/${n.id}?chedType=${chedType}`,
          value: n.id
        },
        { kind: 'text', value: n.status },
        {
          kind: 'text',
          value: mediumDateTime(
            `${n.partOne.arrivalDate}T${n.partOne.arrivalTime}`
          )
        },
        { kind: 'text', value: n.partOne.pointOfEntry },
        { kind: 'text', value: mediumDateTime(n.lastUpdated) },
        matchStatusNotification(n.movements)
      ]
    )

    return h.view('notifications/notifications-list', {
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
