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
      isActive: request?.path === '/notifications'
    },
    {
      text: 'About',
      url: '/about',
      isActive: request?.path === '/about'
    }
  ]
}

/**
 * @import { Request } from '@hapi/hapi'
 */
