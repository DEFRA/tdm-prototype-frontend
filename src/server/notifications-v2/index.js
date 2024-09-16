import { notificationsv2Controller } from '~/src/server/notifications-v2/controller.js'

/**
 * Sets up the routes used in the /notifications page.
 * These routes are registered in src/server/router.js.
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const notificationsv2 = {
  plugin: {
    name: 'notificationsv2',
    register(server) {
      server.route([
        {
          method: 'GET',
          path: '/notifications-v2',
          ...notificationsv2Controller
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
