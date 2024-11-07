// OpenTelemetry
import { Resource } from '@opentelemetry/resources'
import {
  ConsoleSpanExporter,
  BatchSpanProcessor,
  SimpleSpanProcessor
} from '@opentelemetry/sdk-trace-base'
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc'
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node'
import { trace, context, propagation } from '@opentelemetry/api'
// import { trace, , Span, SpanStatusCode } from '@opentelemetry/api';

// instrumentations
import { HapiInstrumentation } from '@opentelemetry/instrumentation-hapi'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { B3Propagator, B3InjectEncoding } from '@opentelemetry/propagator-b3'

import axios from 'axios'

function initialise(serviceName) {
  const exporter = new ConsoleSpanExporter()
  const oltpExporter = new OTLPTraceExporter({
    url: 'http://localhost:18889'
  })

  // "service.name" is supposed to use a constant.

  const provider = new NodeTracerProvider({
    resource: new Resource({ 'service.name': serviceName })
  })
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter))
  provider.addSpanProcessor(
    new BatchSpanProcessor(oltpExporter, {
      maxQueueSize: 1000,
      scheduledDelayMillis: 3000
    })
  )
  provider.register({
    propagator: new B3Propagator({
      injectEncoding: B3InjectEncoding.MULTI_HEADER
    })
  })
  registerInstrumentations({
    instrumentations: [new HapiInstrumentation(), new HttpInstrumentation()],
    tracerProvider: provider
  })

  // Add a request interceptor
  axios.interceptors.request.use(
    function (config) {
      const traceHeaders = {}
      propagation.inject(context.active(), traceHeaders)

      if (Object.keys(traceHeaders).length) {
        Object.entries(traceHeaders).forEach(
          ([k, v]) => (config.headers[k] = v)
        )
        config.headers.traceparent = `00-${traceHeaders['x-b3-traceid']}-${traceHeaders['x-b3-spanid']}-01`
      }

      return config
    },
    function (error) {
      // Do something with request error
      return Promise.reject(error)
    }
  )

  return trace.getTracer(serviceName)
}

export { initialise }
