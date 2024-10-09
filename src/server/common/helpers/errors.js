/**
 * @param {number} statusCode
 */
function statusCodeMessage(statusCode) {
  // Returns string for standard messages, array including
  // custom error filename if wanted.
  switch (true) {
    case statusCode === 404:
      return 'Page not found'
    case statusCode === 403:
      return 'Forbidden'
    case statusCode === 401:
      return ['Unauthorized', 'error/unauthorised']
    case statusCode === 400:
      return 'Bad Request'
    default:
      return 'Something went wrong'
  }
}

/**
 * @param {Request} request
 * @param {ResponseToolkit} h
 */
export function catchAll(request, h) {
  const { response } = request

  if (!('isBoom' in response)) {
    return h.continue
  }

  request.logger.error(response?.stack)

  const statusCode = response.output.statusCode
  const error = statusCodeMessage(statusCode)
  const errorMessage = error.constructor === Array ? error[0] : error
  const errorView = error.constructor === Array ? error[1] : 'error/index'

  return h
    .view(errorView, {
      pageTitle: errorMessage,
      heading: statusCode,
      message: errorMessage
    })
    .code(statusCode)
}

/**
 * @import { Request, ResponseToolkit } from '@hapi/hapi'
 */
