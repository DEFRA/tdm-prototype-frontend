import { config } from '~/src/config/index.js'
const authenticatedProxyController = {
  handler: (request, h) => {
    return { params: request.params, query: request.query }
  }
}

export { authenticatedProxyController }
