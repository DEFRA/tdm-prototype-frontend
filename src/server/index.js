import { initialise } from '~/src/server/common/helpers/otel-tracer.js'
import path from 'path'
import hapi from '@hapi/hapi'

import { router } from './router.js'
import { config } from '~/src/config/index.js'
import { nunjucksConfig } from '~/src/config/nunjucks/index.js'
import { requestLogger } from '~/src/server/common/helpers/logging/request-logger.js'
import { catchAll } from '~/src/server/common/helpers/errors.js'
import { defraId } from '~/src/server/common/helpers/auth/defra-id.js'
import { sessionManager } from '~/src/server/common/helpers/session-manager.js'
import { sessionCookie } from '~/src/server/common/helpers/auth/session-cookie.js'
import { getUserSession } from '~/src/server/common/helpers/auth/get-user-session.js'
import { dropUserSession } from '~/src/server/common/helpers/auth/drop-user-session.js'
import { secureContext } from '~/src/server/common/helpers/secure-context/index.js'
import { getCacheEngine } from '~/src/server/common/helpers/session-cache/cache-engine.js'
import { pulse } from '~/src/server/common/helpers/pulse.js'
import { serverVersion } from '~/src/server/common/helpers/server-version.js'
import { trace } from '@opentelemetry/api'
initialise('tdm-prototype-frontend')

export async function createServer() {
  const tracer = trace.getTracer('globals')

  return tracer.startActiveSpan('create-server', async (span) => {
    span.addEvent('create-server')
    span.setAttribute('Date', new Date().toString())

    const result = await createServerWithTracing()
    span.end()
    return result
  })
}

async function createServerWithTracing() {
  const server = hapi.server({
    port: config.get('port'),
    routes: {
      auth: {
        mode: 'required'
      },
      validate: {
        options: {
          abortEarly: false
        }
      },
      files: {
        relativeTo: path.resolve(config.get('root'), '.public')
      },
      security: {
        hsts: {
          maxAge: 31536000,
          includeSubDomains: true,
          preload: false
        },
        xss: 'enabled',
        noSniff: true,
        xframe: true
      }
    },
    router: {
      stripTrailingSlash: true
    },
    cache: [
      {
        name: config.get('session.cache.name'),
        engine: getCacheEngine(config.get('session.cache.engine'))
      }
    ]
  })

  // @ts-expect-error unsure why it's so upset
  server.app.cache = server.cache({
    cache: 'session',
    expiresIn: config.get('session.cache.ttl'),
    segment: 'session'
  })

  server.decorate('request', 'getUserSession', getUserSession)
  server.decorate('request', 'dropUserSession', dropUserSession)

  await server.register([
    serverVersion,
    sessionManager,
    defraId,
    sessionCookie,
    // sessionCache,
    requestLogger,
    secureContext,
    pulse,
    nunjucksConfig,
    router // Register all the controllers/routes defined in src/server/router.js
  ])

  server.ext('onPreResponse', catchAll)

  return server
}
