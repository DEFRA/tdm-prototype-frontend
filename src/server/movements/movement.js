import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import {
  movementMatchStatus,
  movementGetChecks,
  movementDecisionStatusFromChecks
} from '~/src/server/common/helpers/movement-status.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'

import { getClient } from '~/src/server/common/models.js'
import { movementViewModelItems } from '~/src/server/common/helpers/movement-view-models.js'
import {
  notificationMatchStatus,
  notificationPartTwoStatus,
  notificationStatus
} from '~/src/server/common/helpers/notification-status.js'
import { notificationViewModelItems } from '~/src/server/common/helpers/notification-view-model.js'

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
        ;({ data } = await client.find('movements', movementId, {}))
        logger.info(`Result received, ${data.id}`)
        // data = response
      } catch (e) {
        logger.error(`Error from api call, ${e}`)
      }

      let notifications = []
      let notification1 = null
      let notification1Commodities = []
      let notification1MatchStatus = null
      let notification1PartTwoStatus = null
      if (data.notifications) {
        logger.info(`Movement matched, ${data.notifications}`)
        const notificationIds = new Set(data.notifications.map((n) => n.id))

        // Get notification(s)
        notifications = await Promise.all(
          Array.from(notificationIds).map(async (id) => {
            const { data: m } = await client.find('notifications', id, {})

            return m
          })
        )

        notification1 = notifications ? notifications[0] : null
        notification1Commodities = notificationViewModelItems(notification1)
        notification1MatchStatus = notification1
          ? notificationMatchStatus(notification1)
          : null
        notification1PartTwoStatus = notification1
          ? notificationPartTwoStatus(notification1)
          : null
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
        matchOutcome: movementMatchStatus(data),
        decision: movementDecisionStatusFromChecks(checkStatus),
        // TODO : display the first match info for now
        notification1,
        notification1Status: notification1
          ? notificationStatus(notification1)
          : null,
        notification1MatchStatus,
        notification1Commodities,
        notification1PartTwoStatus
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
