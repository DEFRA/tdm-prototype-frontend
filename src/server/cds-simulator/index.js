import { createClearanceRequestController } from '~/src/server/cds-simulator/create-clearance-request.js'
const cdsSimulator = {
  plugin: {
    name: 'cds-simulator',
    register: (server) => {
      server.route([
        {
          method: 'POST',
          path: '/cds-simulator/create-clearance-request/{notification}',
          ...createClearanceRequestController
        }
      ])
    }
  }
}

export { cdsSimulator }
