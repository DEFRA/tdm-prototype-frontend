import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import {
  movementDecisionStatus,
  movementMatchStatus,
  movementItemMatchStatus,
  movementItemDecisionStatus,
  // movementItemCheckAddStatus,
  // matchStatusNotification
  movementGetChecks,
  movementDecisionStatusFromChecks,
} from '~/src/server/common/helpers/movement-status.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'

import { getClient } from '~/src/server/common/models.js'
import { movementViewModelItems } from '~/src/server/common/helpers/movement-view-models.js'

export const movementController = {
  async handler(request, h) {
    const logger = createLogger()
    const movementId = request.params.id

    // Get filter details to include on breadcrumb
    // const chedType = request.query?.chedType || 'Cveda'

    try {
      logger.info(`Querying JSON API for movement, movementId=${movementId}`)
      const client = await getClient(request)
      let data = null

      try {
        ;({ data } = await client.find('movements', movementId, {
          // 'fields[ipaffsNotifications]':
          //   'lastUpdated,lastUpdatedBy,status,ipaffsType,partOne'
        }))
        logger.info(`Result received, ${data.id}`)
        // data = response
      } catch (e) {
        logger.error(`Error from api call, ${e}`)
      }

      const items = movementViewModelItems(data)

      const auditEntries = data?.auditEntries
        ? data?.auditEntries.map((i) => [
            { kind: 'text', value: i.version },
            { kind: 'text', value: i.createdBy },
            { kind: 'text', value: mediumDateTime(i.createdSource) },
            { kind: 'text', value: mediumDateTime(i.createdLocal) },
            { kind: 'text', value: i.status }
          ])
        : []

      const checkStatus = movementGetChecks(data)

      const checks = checkStatus.map(([i, c]) => [
        { kind: 'text', value: i.itemNumber },
        { kind: 'text', value: c.checkCode },
        { kind: 'text', value: c.decisionCode },
        { kind: 'text', value: c.departmentCode },
        { kind: 'tag', value: c.decisionMessage, classes: c.displayClass }
      ])

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
            href: `/auth/proxy/api/movements/${movementId}`
          }
        ],
        movement: data,
        notification: null,
        lastUpdated: mediumDateTime(data?.lastUpdated),
        items,
        auditEntries,
        checks,
        matchOutcome: movementMatchStatus(data?.relationships),
        // decision: movementDecisionStatus(checkStatus)
        decision: movementDecisionStatusFromChecks(checkStatus)
      })
    } catch (e) {
      logger.error(e)
      throw e
    }
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
