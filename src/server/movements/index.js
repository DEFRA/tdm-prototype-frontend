import { movementController } from '~/src/server/movements/movement.js'
import { movementsListController } from '~/src/server/movements/movements-list.js'

/**
 * Sets up the routes used in the /notifications page.
 * These routes are registered in src/server/router.js.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const movements = {
  plugin: {
    name: 'movements',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/movements',
          ...movementsListController
        },
        {
          method: 'GET',
          path: '/movements/{id}',
          ...movementController
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
