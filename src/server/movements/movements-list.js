import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
// import { appTag } from 'cdp-portal-frontend/src/server/common/components/tag'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'

import { getClient } from '~/src/server/common/models.js'
import {
  movementDecisionStatus,
  movementMatchStatus
} from '~/src/server/common/helpers/movement-status.js'

export const movementsListController = {
  async handler(request, h) {
    const logger = createLogger()

    logger.info(`Querying JSON API for movements`)
    const client = await getClient(request)
    const { data } = await client.findAll('movements', {
      sort: '-lastUpdated'
      // 'fields[movements]': 'notifications,lastUpdated,items,goodsLocationCode'
    })

    logger.info(data)
    let movements = []

    try {
      movements = data.map((m) => [
        {
          kind: 'link',
          url: `/movements/${m.id}`,
          value: m.id
        },
        { kind: 'text', value: m.goodsLocationCode }, // m.status
        { kind: 'text', value: m.items.length }, // m.status
        { kind: 'text', value: mediumDateTime(m.lastUpdated) }, // new Date(m.lastUpdated).toLocaleString()
        movementDecisionStatus(m),
        movementMatchStatus(m)
      ])
    } catch (e) {
      logger.error(e)
    }

    return h.view('movements/movements-list', {
      pageTitle: 'Movements',
      heading: 'Movements',
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Movements'
        }
      ],
      // data,
      movements
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
