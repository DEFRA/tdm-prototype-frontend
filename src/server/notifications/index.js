import { notificationController } from '~/src/server/notifications/notification.js'
import { notificationsListController } from '~/src/server/notifications/notifications-list.js'

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
          ...notificationsListController
        },
        {
          method: 'GET',
          path: '/notification/{id}',
          ...notificationController
        }
      ])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
