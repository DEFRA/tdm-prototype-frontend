import { createLogger } from '~/src/server/common/helpers/logging/logger.js'
import { config } from '~/src/config/index.js'
import axios from 'axios'

const sendDecisionsController = {
  handler: async (request, h) => {
    const logger = createLogger()
    const requested = { params: request.params, query: request.query }
    logger.info(
      `Simulator Actions received request: ${JSON.stringify(requested)}`
    )

    const backendApi = config.get('tdmBackendApi')
    const authedUser = await request.getUserSession()
    const url = `${backendApi}/simulator/send-decisions/${request.params.notification}/${request.params.scenario}`

    await axios.get(url, {
      headers: {
        Authorization: `Bearer ${authedUser.jwt}`
      }
    })

    // Sleep a short while to allow the match to hopefully happen
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    await sleep(5000)
    return h.redirect(`/notifications/${request.params.notification}`)
  }
}

export { sendDecisionsController }
