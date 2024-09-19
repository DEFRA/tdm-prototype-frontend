import JsonApi from 'devour-client'
import { config } from '~/src/config/index.js'

const jsonApi = new JsonApi({ apiUrl: config.get('tdmBackendApi') })

// Define Model
jsonApi.define('movement', {
  version: '',
  status: '',
  lastUpdated: '',
  notification: {
    matched: false,
    reference: '',
    item: ''
  },
  items: [
    {
      itemNumber: 0,
      customsProcedureCode: '',
      taricCommodityCode: '',
      goodsDescription: '',
      gmr: {
        matched: false,
        reference: '',
        item: ''
      }
    }
  ]
})

jsonApi.define('notification', {
  version: '',
  status: '',
  notificationType: '',
  ipaffsType: '',
  lastUpdated: '',
  lastUpdatedBy: {
    displayName: '',
    userId: ''
  },
  partOne: {
    commodities: {
      numberOfPackages: 0,
      countryOfOrigin: '',
      commodityComplement: [
        {
          commodityID: '',
          commodityDescription: '',
          complementName: ''
        }
      ]
    },
    consignor: {
      id: '',
      type: '',
      status: '',
      companyName: ''
    },
    personResponsible: {
      id: '',
      type: '',
      status: '',
      companyName: ''
    },
    importer: {
      id: '',
      type: '',
      status: '',
      companyName: ''
    },
    movement: {
      matched: false,
      reference: '',
      item: 0,
      additionalInformation: null
    }
  }
})

export { jsonApi }
