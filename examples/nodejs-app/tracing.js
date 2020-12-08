const winston = require('winston');
const { getLogger, initTracing, getTracingExporterOptions } = require('@teracyhq-incubator/logging-tracing');
const { CloudPropagator } = require('@google-cloud/opentelemetry-cloud-trace-propagator');

const tracingLogger = getLogger('tracing', {
  transports: [
    new winston.transports.Console({
      level: 'info'
    })
  ]
});

const exporterSpec = process.env.TRACE_EXPORTER || "";

let exporterOpts = {}, registerOpts = {};

switch(exporterSpec) {
  case "ZIPKIN":
    exporterOpts = Object.assign(exporterOpts, getTracingExporterOptions(), {
      serviceName: "nodejs-app"
    });
    break;
  case "GOOGLE_CLOUD_TRACE":
    registerOpts = {
      // Use CloudPropagator
      propagator: new CloudPropagator()
    };
    break;
}


const opts = {
  provider: {
    logger: tracingLogger,
    plugins: {
      http: {
        enabled: true,
        path: '@opentelemetry/plugin-http'
        // ignoreIncomingPaths: ['/healthz']
      },
      https: {
        enabled: true,
        path: '@opentelemetry/plugin-https'
      },
      express: {
        enabled: true,
        path: '@opentelemetry/plugin-express'
      }
    }
  },
  exporter: exporterOpts,
  register: registerOpts
}

initTracing(opts)
