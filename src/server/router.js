import inert from '@hapi/inert'

import { health } from '~/src/server/health/index.js'
import { home } from '~/src/server/home/index.js'
import { about } from '~/src/server/about/index.js'
import { serveStaticFiles } from '~/src/server/common/helpers/serve-static-files.js'
import { notifications } from '~/src/server/notifications/index.js'
import { movements } from '~/src/server/movements/index.js'

import { login } from '~/src/server/login/index.js'
import { logout } from '~/src/server/logout/index.js'
import { auth } from '~/src/server/auth/index.js'
import { cdsSimulator } from '~/src/server/cds-simulator/index.js'
import { admin } from '~/src/server/admin/index.js'

/**
 * @satisfies {ServerRegisterPluginObject<void>}
 */
export const router = {
  plugin: {
    name: 'router',
    async register(server) {
      await server.register([inert])

      // Health-check route. Used by platform to check if service is running, do not remove!
      await server.register([health])

      // Application specific routes, add your own routes here
      await server.register([
        movements,
        notifications,
        home,
        about,
        auth,
        login,
        logout,
        cdsSimulator,
        admin
      ])

      // Static assets
      await server.register([serveStaticFiles])
    }
  }
}

/**
 * @import { ServerRegisterPluginObject } from '@hapi/hapi'
 */
