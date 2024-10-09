import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

import { getClient } from '~/src/server/common/models.js'
import {
  gmrStateItemList,
  gmrExpectedArrival,
  gmrExpectedDeparture
} from '~/src/server/common/helpers/gmr-status.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'

export const gmrsListController = {
  async handler(request, h) {
    const logger = createLogger()

    logger.info(`Querying JSON API for gmrs`)

    const client = await getClient(request)
    const { data } = await client.findAll('gmrs', {
      sort: '-lastUpdated'
      // 'fields[notifications]': 'movements,lastUpdated,status,ipaffsType,partOne'
    })

    const gmrs = data.map((g) => [
      {
        kind: 'link',
        url: `/gmrs/${g.id}`,
        value: g.id
      },
      gmrStateItemList(g),
      { kind: 'text', value: 19 },
      // gmrInspectionRequiredItemList(g),
      { kind: 'text', value: gmrExpectedDeparture(g) },
      { kind: 'text', value: gmrExpectedArrival(g) },
      { kind: 'text', value: mediumDateTime(g.lastUpdated) }
      // gmrMatchItemList(g)
    ])

    return h.view('gmrs/gmrs-list', {
      pageTitle: 'GMRs',
      heading: 'GMRs',
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Gmrs'
        }
      ],
      gmrs
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
