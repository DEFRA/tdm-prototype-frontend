import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation.js'

/**
 * @param {Partial<Request>} [options]
 */
function mockRequest(options) {
  return { ...options }
}

describe('#buildNavigation', () => {
  test('Should provide expected navigation details', () => {
    expect(
      buildNavigation(mockRequest({ path: '/non-existent-path' }))
    ).toEqual({
      activeLinkId: `non-existent-pathLink`,
      items: [
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
    })
  })

  test('Should provide expected highlighted navigation details', () => {
    expect(buildNavigation(mockRequest({ path: '/' }))).toEqual({
      activeLinkId: `homeLink`,
      items: [
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
    })
  })

  test('Should provide expected highlighted navigation details deep', () => {
    expect(
      buildNavigation(mockRequest({ path: '/notifications/test/123' }))
    ).toEqual({
      activeLinkId: `notificationsLink`,
      items: [
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
    })
  })
})

/**
 * @import { Request } from '@hapi/hapi'
 */
