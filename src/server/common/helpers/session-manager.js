import yar from '@hapi/yar'
import { config } from '~/src/config/index.js'

const sessionManager = {
  plugin: yar,
  options: {
    name: 'cdpDefraIdSession',
    maxCookieSize: 0, // Always use server-side storage
    cache: { cache: 'session' },
    storeBlank: false,
    errorOnCacheNotReady: true,
    cookieOptions: {
      password: config.get('session.cookie.password'),
      isSecure: config.get('isProduction')
    }
  }
}

export { sessionManager }
