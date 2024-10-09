/**
 * A GDS styled example home page controller.
 * Provided as an example, remove or modify as required.
 * @satisfies {Partial<ServerRoute>}
 */
import { config } from '~/src/config/index.js'

export const aboutController = {
  handler(request, h) {
    const tdmBackendApi = config.get('tdmBackendApi')
    const tdmBackendExampleNotification = config.get(
      'tdmBackendExampleNotification'
    )
    return h.view('about/index', {
      pageTitle: 'About',
      heading: 'About',
      tdmApiUri: '/auth/proxy',
      tdmApiDirectUri: tdmBackendApi,
      tdmBackendExampleNotification
    })
  }
}

/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
