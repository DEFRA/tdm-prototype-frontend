/**
 * A GDS styled example home page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
import { config } from '~/src/config/index.js'

export const homeController = {
  handler(request, h) {
    const tdmBackendApi = config.get('tdmBackendApi')
    const tdmBackendExampleNotification = config.get(
      'tdmBackendExampleNotification'
    )
    return h.view('home/index', {
      pageTitle: 'Home',
      heading: 'Home',
      tdmBackendApi,
      tdmBackendExampleNotification
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
