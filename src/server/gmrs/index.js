import { gmrController } from '~/src/server/gmrs/gmr.js'
import { gmrsListController } from '~/src/server/gmrs/gmrs-list.js'

/**
 * Sets up the routes used in the /notifications page.
 * These routes are registered in src/server/router.js.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const gmrs = {
  plugin: {
    name: 'gmrs',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/gmrs',
          ...gmrsListController
        },
        {
          method: 'GET',
          path: '/gmrs/{id}',
          ...gmrController
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
