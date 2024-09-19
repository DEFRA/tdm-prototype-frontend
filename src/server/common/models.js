import JsonApi from 'devour-client'
import { config } from '~/src/config/index.js'

const jsonApi = new JsonApi({ apiUrl: config.get('tdmBackendApi') })

const matchModel = {
  matched: false,
  reference: '',
  item: ''
}
// { ...matchModel}

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
      gmr: { ...matchModel }
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
  movement: {
    matched: false,
    reference: '',
    item: 0,
    additionalInformation: null
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
    }
  }
})

export { jsonApi }
