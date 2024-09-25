import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
// import { appTag } from 'cdp-portal-frontend/src/server/common/components/tag'

import { jsonApi } from '~/src/server/common/models.js'

export const movementsListController = {
  async handler(request, h) {
    const logger = createLogger()

    logger.info(`Querying JSON API for movements`)

    const { data } = await jsonApi.findAll('movements', {
      sort: '-lastUpdated',
      'fields[movements]': 'lastUpdated,notification'
    })

    logger.info(data)

    const movements = data.map((m) => [
      {
        kind: 'link',
        url: `/movements/${m.id}`,
        value: m.id
      },
      { kind: 'text', value: '' }, // m.status
      { kind: 'text', value: new Date(m.lastUpdated).toLocaleString() }, // new Date(m.lastUpdated).toLocaleString()
      { kind: 'tag', value: 'No Match', classes: 'govuk-tag--red' }
    ])

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