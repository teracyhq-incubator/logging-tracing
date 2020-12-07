const { NodeTracerProvider } = require('@opentelemetry/node');
const { ConsoleSpanExporter, SimpleSpanProcessor, BatchSpanProcessor } = require('@opentelemetry/tracing');
const { TraceExporter } = require('@google-cloud/opentelemetry-cloud-trace-exporter');
const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const { JaegerExporter } = require("@opentelemetry/exporter-jaeger");

const logging = require('./logging');

const logger = logging.getLogger('logging-tracing:tracing');

function getExporter(opts) {
  let exporter;
  const exporterSpec = process.env.TRACE_EXPORTER || "";
  switch(exporterSpec) {
    case "CONSOLE_SPAN":
      exporter = new ConsoleSpanExporter(opts);
      logger.info(`tracing with ${exporterSpec} exporter`);
      break;
    case "GOOGLE_CLOUD_TRACE":
      exporter = new TraceExporter(opts);
      logger.info(`tracing with ${exporterSpec} exporter`);
      break;
    case "ZIPKIN":
      exporter = new ZipkinExporter(opts);
      logger.info(`tracing with ${exporterSpec} exporter`);
      break;
    case "JAEGER":
      exporter = new JaegerExporter(opts);
      logger.info(`tracing with ${exporterSpec} exporter`);
      break;
    default:
      logger.info("no tracing exporter is specified");
  }
  return exporter;
}


function getProcessor(exporter) {
  const processorSpec = process.env.TRACE_PROCESSOR || "SimpleSpanProcessor";
  let processor;

  if (processorSpec === "BatchSpanProcessor") {
    processor = new BatchSpanProcessor(exporter);
    logger.info(`tracing with ${processorSpec} processor`);
  } else if (processorSpec == "SimpleSpanProcessor") {
    processor = new SimpleSpanProcessor(exporter); // default
    logger.info(`tracing with ${processorSpec} processor`);
  } else {
    logger.warn(`tracing with ${processorSpec} processor is NOT supported`);
  }

  return processor;
}


// specify the env of exporter, processor to be used, default: "" means none
// TRACE_EXPORTER="" | "CONSOLE_SPAN" | "GOOGLE_CLOUD_TRACE" || "ZIPKIN" || "JAEGER"
// TRACE_EXPORTER_OPTIONS="{}" // json string to be parsed as options object
// TRACE_PROCESSOR="SimpleSpanProcessor" || "BatchSpanProcessor"
// Enable OpenTelemetry exporters to export traces to Google Cloud Trace.
// Exporters use Application Default Credentials (ADCs) to authenticate.
// See https://developers.google.com/identity/protocols/application-default-credentials
// for more details.

exports.getTracingExporterOptions = function() {
  const optStr = process.env.TRACE_EXPORTER_OPTIONS || "{}";
  try {
    return JSON.parse(optStr)
  } catch(err) {
    logger.warn(err);
    return {};
  }
}


exports.initTracing = function(opts) { // opts.provider; opts.exporter; opts.register
  logger.info("tracing is initializing with opts:", opts);
  const providerOpts = opts.provider || {};
  const exporterOpts = opts.exporter || {};
  const registerOpts = opts.register || {};

  const exporter = getExporter(exporterOpts);
  if (!exporter) {
    logger.warn("tracing exporter is not defined, so tracing is NOT initialized");
    return;
  }
  // Configure the span processor to send spans to the exporter
  const processor = getProcessor(exporter);
  if (!processor) {
    logger.warn("tracing processor is not defined, so tracing is NOT initialized");
  } else {
    const provider = new NodeTracerProvider(providerOpts);
    provider.register(registerOpts);
    provider.addSpanProcessor(processor);
    logger.notice("tracing is initialized");
  }
}
