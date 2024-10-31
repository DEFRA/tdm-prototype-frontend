import { createClearanceRequestController } from '~/src/server/cds-simulator/create-clearance-request.js'
import { sendDecisionsController } from '~/src/server/cds-simulator/send-decisions.js'
const cdsSimulator = {
  plugin: {
    name: 'cds-simulator',
    register: (server) => {
      server.route([
        {
          method: 'POST',
          path: '/cds-simulator/create-clearance-request/{notification}',
          ...createClearanceRequestController
        },
        {
          method: 'POST',
          path: '/cds-simulator/send-decisions/{notification}/{scenario}',
          ...sendDecisionsController
        }
      ])
    }
  }
}

export { cdsSimulator }
