import { config } from '~/src/config/index.js'
const homeController = {
  handler: (request, h) => {
    return h.view('auth/index', {
      pageTitle: 'Auth',
      heading: 'Auth',
      manageAccountUrl: config.get('defraId.manageAccountUrl')
    })
  }
}

export { homeController }
