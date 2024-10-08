import { config } from '~/src/config/index.js'
const homeController = {
  handler: (request, h) => {
    return h.view('admin/index', {
      pageTitle: 'Admin',
      heading: 'Admin',
      manageAccountUrl: config.get('defraId.manageAccountUrl')
    })
  }
}

export { homeController }
