import { get } from 'https'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { config } from '~/src/config/index.js'

const authenticatedProxyController = {
  handler: async (request) => {
    const logger = createLogger()
    const requested = { params: request.params, query: request.query }
    logger.info(
      `Authenticated proxy received request: ${JSON.stringify(requested)}`
    )

    const authedUser = await request.getUserSession()
    const backendApi = new URL(config.get('tdmBackendApi'))
    const qs = new URLSearchParams(request.query)
    return new Promise((resolve, reject) => {
      const options = {
        hostname: backendApi.hostname,
        port: backendApi.port,
        path: `/${request.params.path}?${qs.toString()}`,
        query: request.query,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authedUser.jwt}` // token
        }
      }

      logger.info(`Authenticated proxy options: ${JSON.stringify(options)}`)

      get(options, (res) => {
        const data = []
        logger.info('Status Code:', res.statusCode)

        if (res.statusCode === 200) {
          res.on('data', (chunk) => {
            data.push(chunk)
          })

          res.on('end', () => {
            logger.info('Response ended: ')
            const res = JSON.parse(Buffer.concat(data).toString())
            res.originalQuery = requested
            resolve(res)
          })
        } else {
          logger.info(`Non 200 status received : ${res.statusCode}`)
          resolve({
            originalQuery: requested,
            error: `Proxied API returned ${res.statusCode}`
          })
          // reject(`Non 200 status received : ${res.statusCode}`)
        }
      }).on('error', (err) => {
        logger.error('Error: ', err.message)
        reject(err)
      })
    })
  }
}

export { authenticatedProxyController }
