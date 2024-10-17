import convict from 'convict'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const oneHour = 1000 * 60 * 60
// const fourHours = oneHour * 4
const twelveHours = oneHour * 12
const oneWeekMillis = oneHour * 24 * 7
// const oneDay = 1000 * 60 * 60 * 24

const isProduction = process.env.NODE_ENV === 'production'

export const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    env: 'PORT'
  },
  tdmBackendApi: {
    doc: 'The Trade Data Matching json:api backend.',
    format: String,
    default: 'https://tdm-prototype-backend.localtest.me:3080',
    env: 'TDM_API_BACKEND'
  },
  tdmBackendExampleNotification: {
    doc: 'An example CHED ID from the backend.',
    format: String,
    default: 'CHEDA.GB.2024.1009875',
    env: 'TDM_API_EXAMPLE_NOTIFICATION'
  },
  staticCacheTimeout: {
    doc: 'Static cache timeout in milliseconds',
    format: Number,
    default: oneWeekMillis,
    env: 'STATIC_CACHE_TIMEOUT'
  },
  serviceName: {
    doc: 'Applications Service Name',
    format: String,
    default: 'Trade Data Matching ALVS V2 POC'
  },
  root: {
    doc: 'Project root',
    format: String,
    default: path.resolve(dirname, '../..')
  },
  assetPath: {
    doc: 'Asset path',
    format: String,
    default: '/public',
    env: 'ASSET_PATH'
  },
  isProduction: {
    doc: 'If this application running in the production environment',
    format: Boolean,
    default: isProduction
  },
  isDevelopment: {
    doc: 'If this application running in the development environment',
    format: Boolean,
    default: process.env.NODE_ENV !== 'production'
  },
  isTest: {
    doc: 'If this application running in the test environment',
    format: Boolean,
    default: process.env.NODE_ENV === 'test'
  },
  log: {
    enabled: {
      doc: 'Is logging enabled',
      format: Boolean,
      default: process.env.NODE_ENV !== 'test',
      env: 'LOG_ENABLED'
    },
    level: {
      doc: 'Logging level',
      format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'],
      default: 'info',
      env: 'LOG_LEVEL'
    },
    format: {
      doc: 'Format to output logs in.',
      format: ['ecs', 'pino-pretty'],
      default: isProduction ? 'ecs' : 'pino-pretty',
      env: 'LOG_FORMAT'
    }
  },
  httpProxy: /** @type {SchemaObj<string | null>} */ ({
    doc: 'HTTP Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTP_PROXY'
  }),
  httpsProxy: /** @type {SchemaObj<string | null>} */ ({
    doc: 'HTTPS Proxy',
    format: String,
    nullable: true,
    default: null,
    env: 'CDP_HTTPS_PROXY'
  }),
  enableSecureContext: {
    doc: 'Enable Secure Context',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_SECURE_CONTEXT'
  },
  enableMetrics: {
    doc: 'Enable metrics reporting',
    format: Boolean,
    default: isProduction,
    env: 'ENABLE_METRICS'
  },
  session: {
    cache: {
      engine: {
        doc: 'backend cache is written to',
        format: ['redis', 'memory'],
        default: 'redis',
        env: 'SESSION_CACHE_ENGINE'
      },
      name: {
        doc: 'server side session cache name',
        format: String,
        default: 'session',
        env: 'SESSION_CACHE_NAME'
      },
      ttl: {
        doc: 'server side session cache ttl',
        format: Number,
        default: twelveHours,
        env: 'SESSION_CACHE_TTL'
      }
    },
    cookie: {
      ttl: {
        doc: 'Session cookie ttl',
        format: Number,
        default: twelveHours,
        env: 'SESSION_COOKIE_TTL'
      },
      password: {
        doc: 'session cookie password',
        format: String,
        default: 'the-password-must-be-at-least-32-characters-long',
        env: 'SESSION_COOKIE_PASSWORD',
        sensitive: true
      },
      secure: {
        doc: 'set secure flag on cookie',
        format: Boolean,
        default: isProduction,
        env: 'SESSION_COOKIE_SECURE'
      }
    }
  },
  redis: /** @type {Schema<RedisConfig>} */ ({
    host: {
      doc: 'Redis cache host',
      format: String,
      default: '127.0.0.1',
      env: 'REDIS_HOST'
    },
    username: {
      doc: 'Redis cache username',
      format: String,
      default: '',
      env: 'REDIS_USERNAME'
    },
    password: {
      doc: 'Redis cache password',
      format: '*',
      default: '',
      sensitive: true,
      env: 'REDIS_PASSWORD'
    },
    keyPrefix: {
      doc: 'Redis cache key prefix name used to isolate the cached results across multiple clients',
      format: String,
      default: 'tdm-prototype-frontend:',
      env: 'REDIS_KEY_PREFIX'
    },
    useSingleInstanceCache: {
      doc: 'Connect to a single instance of redis instead of a cluster.',
      format: Boolean,
      default: !isProduction,
      env: 'USE_SINGLE_INSTANCE_CACHE'
    }
  }),
  appBaseUrl: {
    doc: 'Application base URL for after we login',
    format: String,
    default: 'http://tdm-prototype-frontend.localtest.me:3000',
    env: 'APP_BASE_URL'
  },
  defraId: {
    manageAccountUrl: {
      doc: 'DEFRA ID Manage Account URL, defaults to docker compose defra ID stub',
      format: String,
      env: 'DEFRA_ID_MANAGE_ACCOUNT_URL',
      default:
        'http://cdp-defra-id-stub.localtest.me:7200/cdp-defra-id-stub/login'
    },
    oidcConfiguration: {
      url: {
        doc: 'DEFRA ID OIDC Configuration URL, defaults to docker compose defra ID stub',
        format: String,
        env: 'DEFRA_ID_OIDC_CONFIGURATION_URL',
        default:
          'http://cdp-defra-id-stub.localtest.me:7200/cdp-defra-id-stub/.well-known/openid-configuration'
      }
    },
    serviceId: {
      doc: 'DEFRA ID Service ID',
      format: String,
      env: 'DEFRA_ID_SERVICE_ID',
      default: 'd7d72b79-9c62-ee11-8df0-000d3adf7047'
    },
    clientId: {
      doc: 'DEFRA ID Client ID',
      format: String,
      env: 'DEFRA_ID_CLIENT_ID',
      default: '2fb0d715-affa-4bf1-836e-44a464e3fbea'
    },
    clientSecret: {
      doc: 'DEFRA ID Client Secret',
      format: String,
      sensitive: true,
      env: 'DEFRA_ID_CLIENT_SECRET',
      default: 'test_value'
    }
  }
})

config.validate({ allowed: 'strict' })

/**
 * @import { Schema, SchemaObj } from 'convict'
 * @import { RedisConfig } from '~/src/server/common/helpers/redis-client.js'
 */
