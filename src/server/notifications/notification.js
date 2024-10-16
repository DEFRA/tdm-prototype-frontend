/**
 * A GDS styled example notifications page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import {
  notificationMatchStatus,
  notificationStatus,
  notificationPartTwoStatus,
  notificationCheckStatus,
  booleanTag
} from '~/src/server/common/helpers/notification-status.js'

import {
  movementDecisionStatus,
  movementItemCheckDecisionStatus
} from '~/src/server/common/helpers/movement-status.js'

import { getClient } from '~/src/server/common/models.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'
import { inspectionStatusNotification } from '~/src/server/common/helpers/inspection-status.js'
import { movementViewModelItems } from '~/src/server/common/helpers/movement-view-models.js'
import { cleanPascalCase } from '~/src/server/common/helpers/string-cleaner.js'
import { notificationViewModelItems } from '~/src/server/common/helpers/notification-view-model.js'

export const notificationController = {
  async handler(request, h) {
    const logger = createLogger()
    const chedId = request.params.id

    // Get filter details to include on breadcrumb
    const chedType = request.query?.chedType || 'Cveda'

    logger.info(
      `Querying JSON API for notification, chedId=${chedId}, chedType=${chedType}`
    )

    const client = await getClient(request)
    const { data: notification } = await client.find('notifications', chedId, {
      // 'fields[notifications]':
      //   'movements,lastUpdated,lastUpdatedBy,status,ipaffsType,partOne,auditEntries'
    })
    logger.info(`Result received, ${notification.id}`)

    let hmrcChecks = []
    let movements = []
    let movement1 = null
    let movement1Commodities = []
    let movement1Decision = null
    let movement1Item1 = null

    if (notification.relationships.movements.matched) {
      logger.info(
        `Notification matched, ${notification.relationships.movements}`
      )
      const movementIds = new Set(
        notification.relationships.movements.data.map((m) => m.id)
      )

      // Get movement(s)
      movements = await Promise.all(
        Array.from(movementIds).map(async (id) => {
          const { data: m } = await client.find('movements', id, {
            // 'fields[notifications]':
            //   'movements,lastUpdated,lastUpdatedBy,status,ipaffsType,partOne,auditEntries'
          })

          return m
        })
      )
      // [m.id, i.itemNumber, i.checks]
      hmrcChecks = movements
        .map((m) =>
          m.items.map((i) =>
            i.checks.map((c) => {
              return { ...c, movement: m.id, item: i.itemNumber }
            })
          )
        )
        .flat(2)

      movement1 = movements ? movements[0] : null
      movement1Commodities = movementViewModelItems(movement1)
      movement1Decision = movementDecisionStatus(movement1)
      movement1Item1 = movement1?.items.length ? movement1.items[0] : null
    }

    hmrcChecks = hmrcChecks.map((c) => [
      { kind: 'text', value: c.item },
      { kind: 'text', value: c.checkCode },
      { kind: 'text', value: c.documentCode },
      { kind: 'text', value: c.departmentCode },
      movementItemCheckDecisionStatus(c)
    ])

    const ipaffsChecks = notification.partTwo?.commodityChecks
      ? notification.partTwo.commodityChecks[0].checks.map((c) => [
          {
            kind: 'text',
            value: 1
          },
          {
            kind: 'text',
            value: cleanPascalCase(c.type)
          },
          { kind: 'text', value: c.reason },
          booleanTag(c.isSelectedForChecks),
          booleanTag(c.hasChecksComplete),
          notificationCheckStatus(c)
        ])
      : null

    try {
      const ipaffsCommodities = notificationViewModelItems(notification)

      const auditEntries = notification.auditEntries
        ? notification.auditEntries.map((i) => [
            { kind: 'text', value: i.version },
            {
              kind: 'text',
              value: i.createdBy,
              itemClasses: ['tdm-text-truncate']
            },
            { kind: 'text', value: mediumDateTime(i.createdSource) },
            { kind: 'text', value: mediumDateTime(i.createdLocal) },
            { kind: 'text', value: i.status }
          ])
        : []

      const commodityTabItems = notification.commodities.reduce(
        (memo, c) => {
          // memo.fragments[c.commodityID] = c
          memo.tabItems.push({
            label: `${c.complementID}: ${c.commodityID}`,
            id: `${c.complementID}-${c.commodityID}`,
            panel: {
              html: `<h2 class="govuk-heading-l">${c.complementID}: ${c.commodityID}</h2><div>TODO : Commodity match movement information</div>`
            }
          })
          return memo
        },
        { fragments: [], tabItems: [] }
      )

      const inspectionStatus = inspectionStatusNotification(notification)
      const partTwoStatus = notificationPartTwoStatus(notification)

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
            text: `Notification ${chedId}`,
            href: `/auth/proxy/api/notifications/${chedId}`
          }
        ],
        notification,
        lastUpdated: mediumDateTime(notification.lastUpdated),
        ipaffsCommodities,
        commodityTabItems,
        auditEntries,
        inspectionStatus,
        notificationStatus: notificationStatus(notification),
        partTwoStatus,
        ipaffsChecks,
        hmrcChecks,
        matchOutcome: notificationMatchStatus(notification),
        // TODO : display the first match info for now
        movement1,
        movement1Item1,
        movement1Decision,
        movement1Commodities
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
