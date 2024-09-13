/**
 * A GDS styled example notifications page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
export const notificationsController = {
  handler(request, h) {
    return h.view('notifications/index', {
      pageTitle: 'Notifications',
      heading: 'Notifications',
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Notifications'
        }
      ]
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
