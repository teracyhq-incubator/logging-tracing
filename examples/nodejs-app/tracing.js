const { initTracing } = require('@teracyhq-incubator/logging-tracing');
const { CloudPropagator } = require('@google-cloud/opentelemetry-cloud-trace-propagator');


const exporterSpec = process.env.TRACE_EXPORTER || "";

let exporterOpts = {}, registerOpts = {};

switch(exporterSpec) {
  case "ZIPKIN":
    exporterOpts = Object.assign(exporterOpts, tracing.getExporterOptions(), {
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
