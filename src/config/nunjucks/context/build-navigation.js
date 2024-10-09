/**
 * @param {Partial<Request> | null} request
 */
export function buildNavigation(request) {
  const items = [
    {
      href: '/',
      text: 'Home',
      id: 'homeLink'
    },
    {
      href: '/notifications',
      text: 'Notifications',
      id: 'notificationsLink'
    },
    {
      href: '/movements',
      text: 'Movements',
      id: 'movementsLink'
    },
    {
      href: '/gmrs',
      text: 'GMRs',
      id: 'gmrsLink'
    },
    {
      href: '/admin',
      text: 'Admin',
      id: 'adminLink'
    },
    {
      href: '/about',
      text: 'About',
      id: 'aboutLink'
    }
  ]
  const segments = request?.path?.toLowerCase().split('/')
  let selected = segments ? segments[1] : ''
  selected = selected === '' ? 'home' : selected

  return {
    activeLinkId: `${selected}Link`,
    items
  }
}

/**
 * @import { Request } from '@hapi/hapi'
 */
