/**
 * A GDS styled example notifications page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'

import { getClient } from '~/src/server/common/models.js'
import { mediumDateTime } from '~/src/server/common/helpers/date-time.js'
import {
  gmrState,
  gmrDeclarationStatus
} from '~/src/server/common/helpers/gmr-status.js'

export const gmrController = {
  async handler(request, h) {
    const logger = createLogger()
    const gmrId = request.params.id

    logger.info(`Querying JSON API for gmr, gmrId=${gmrId}`)

    const client = await getClient(request)
    const { data } = await client.find('gmrs', gmrId, {
      // 'fields[gmrs]':
      //   'movements,lastUpdated,lastUpdatedBy,status,ipaffsType,partOne,auditEntries'
    })
    logger.info(`Result received, ${data.id}`)

    try {
      const auditEntries = data.auditEntries
        ? data.auditEntries.map((i) => [
            { kind: 'text', value: i.version },
            { kind: 'text', value: i.createdBy },
            { kind: 'text', value: mediumDateTime(i.createdSource) },
            { kind: 'text', value: mediumDateTime(i.createdLocal) },
            { kind: 'text', value: i.status }
          ])
        : []

      const customsDeclarations = data.declarations.customs.map((i) => [
        { kind: 'text', value: i.id },
        { kind: 'text', value: '' },
        gmrDeclarationStatus({ matched: false, state: 'No Match' })
      ])

      data.plannedCrossing.localDateTimeOfDeparture = mediumDateTime(
        data.plannedCrossing.localDateTimeOfDeparture
      )

      if (data.checkedInCrossing) {
        data.checkedInCrossing.localDateTimeOfArrival = mediumDateTime(
          data.checkedInCrossing.localDateTimeOfArrival
        )
      }
      if (data.actualCrossing) {
        data.actualCrossing.localDateTimeOfArrival = mediumDateTime(
          data.actualCrossing.localDateTimeOfArrival
        )
      }

      return h.view('gmrs/gmr', {
        pageTitle: `GMR ${gmrId}`,
        heading: `GMR ${gmrId}`,
        breadcrumbs: [
          {
            text: 'Home',
            href: '/'
          },
          {
            text: 'GMRs',
            href: `/gmrs`
          },
          {
            text: `GMR ${gmrId}`,
            href: `/auth/proxy/api/gmrs/${gmrId}`
          }
        ],
        gmr: data,
        lastUpdated: mediumDateTime(data.lastUpdated),
        status: gmrState(data),
        // ipaffsCommodities,
        // commodityTabItems,
        customsDeclarations,
        auditEntries
        // matchOutcome: matchStatusNotification(
        //   data.movements,
        //   data.partOne.commodities.commodityComplement
        // )
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
