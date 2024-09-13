import { notificationsController } from '~/src/server/notifications/controller.js'

/**
 * Sets up the routes used in the /notifications page.
 * These routes are registered in src/server/router.js.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const notifications = {
  plugin: {
    name: 'notifications',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/notifications',
          ...notificationsController
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
