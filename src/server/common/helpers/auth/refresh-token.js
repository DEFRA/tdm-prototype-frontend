import fetch from 'node-fetch'

import { config } from '~/src/config/index.js'

async function refreshAccessToken(request) {
  const authedUser = await request.getUserSession()
  const refreshToken = authedUser?.refreshToken ?? null
  const clientId = config.get('defraId.clientId')
  const clientSecret = config.get('defraId.clientSecret')

  const params = new URLSearchParams()

  params.append('client_id', clientId)
  params.append('client_secret', clientSecret)
  params.append('grant_type', 'refresh_token')
  params.append('refresh_token', refreshToken)
  params.append('scope', `${clientId} openid profile email offline_access`)

  request.logger.info('Access token expired, refreshing...')

  return await fetch(authedUser.tokenUrl, {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cache-Control': 'no-cache'
    },
    body: params
  })
}

export { refreshAccessToken }
