/**
 * @param {Partial<Request> | null} request
 */
export function buildNavigation(request) {
  return [
    {
      text: 'Home',
      url: '/',
      isActive: request?.path === '/'
    },
    {
      text: 'Notifications',
      url: '/notifications',
      isActive: request?.path?.startsWith('/notifications')
    },
    {
      text: 'Movements',
      url: '/movements',
      isActive: request?.path?.startsWith('/movements')
    },
    {
      text: 'About',
      url: '/about',
      isActive: request?.path?.startsWith('/about')
    }
  ]
}

/**
 * @import { Request } from '@hapi/hapi'
 */
