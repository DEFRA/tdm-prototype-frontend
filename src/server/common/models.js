import JsonApi from 'devour-client'
import { config } from '~/src/config/index.js'

// const authedUser = await request.getUserSession()

const getClient = async function (request) {
  const authedUser = await request.getUserSession()
  const jsonApi = new JsonApi({
    apiUrl: config.get('tdmBackendApi'),
    bearer: authedUser.jwt
  })

  // const jsonApi = new JsonApi({ apiUrl: config.get('tdmBackendApi'), bearer: authedUser.jwt })

  const matchModel = {
    matched: false,
    reference: '',
    item: ''
  }

  const auditEntries = [
    {
      id: '',
      version: '',
      lastUpdatedBy: '',
      dateTime: '',
      status: '',
      diff: [
        {
          path: '',
          op: '',
          value: ''
        }
      ]
    }
  ]
  // { ...matchModel}

  // Define Model
  jsonApi.define('movement', {
    version: '',
    status: '',
    lastUpdated: '',
    entryReference: '',
    masterUCR: '',
    declarationPartNumber: '',
    declarationType: '',
    arrivalDateTime: '',
    submitterTURN: '',
    declarantId: '',
    declarantName: '',
    dispatchCountryCode: '',
    goodsLocationCode: '',
    // notification: { ...matchModel },
    items: [
      {
        itemNumber: 0,
        customsProcedureCode: '',
        taricCommodityCode: '',
        goodsDescription: '',
        gmr: { ...matchModel }
      }
    ],
    auditEntries: { ...auditEntries }
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
    // movement: { ...matchModel },
    partOne: {
      commodities: {
        numberOfPackages: 0,
        countryOfOrigin: '',
        commodityComplement: [
          {
            commodityID: '',
            commodityDescription: '',
            complementName: '',
            additionalData: {
              numberPackage: '',
              numberAnimal: '',
              netWeight: ''
            }
          }
        ]
      },
      pointOfEntry: '',
      pointOfEntryControlPoint: '',
      arrivalDate: '',
      arrivalTime: '',
      meansOfTransport: {
        type: '',
        document: '',
        id: ''
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
    },
    auditEntries: { ...auditEntries }
  })

  return jsonApi
}
export { getClient }
