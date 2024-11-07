import { config } from '~/src/config/index.js'

import { createServer } from '~/src/server/index.js'
import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
// import { initialise } from '~/src/server/common/helpers/otel-tracer.js'

async function startServer() {
  try {
    const server = await createServer()
    await server.start()
    // initialise()

    server.logger.info('Server started successfully')
    server.logger.info(
      `Access your frontend on http://localhost:${config.get('port')}`
    )
    return server
  } catch (error) {
    const logger = createLogger()
    logger.info('Server failed to start :(')
    logger.error(error)
  }
}

export { startServer }
