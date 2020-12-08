const express = require('express');
const winston = require('winston');
const { getLogger } = require('@teracyhq-incubator/logging-tracing');

const { MeterProvider } = require('@opentelemetry/metrics');
const { HostMetrics } = require('@opentelemetry/host-metrics');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

const appLogger = getLogger("app")
const promLogger = getLogger('@opentelemetry/exporter-prometheus', {
  transports: [
    new winston.transports.Console({
      level: 'info'
    })
  ]
})

const exporter = new PrometheusExporter(
  { logger: promLogger }, () => {
    promLogger.notice('prometheus scrape endpoint: http://localhost:9464/metrics');
  }
);

const meterProvider = new MeterProvider({
  exporter,
  interval: 2000,
});

const hostMetrics = new HostMetrics({ meterProvider, name: 'nodejs-app-host-metrics' });
hostMetrics.start();


appLogger.info('logging to console transports');
appLogger.info('hello', {name: 'John Doe'});

appLogger.error('error now!!!');
appLogger.crit('critical now!!');

appLogger.warn('warning from the app');
appLogger.crit('very critical now, fix it asap!!!');
appLogger.alert('someone needs to fix this problem asap!!!')
appLogger.emerg('emergency, the system is crashed!!!');

const logger2 = getLogger("category:2");

logger2.debug("debug information");
logger2.error('Error here from logger2');

const overrideLogger = getLogger("overrideLogger", {
  transports: [
    new winston.transports.Console({
      level: 'debug'
    })
  ]
});

overrideLogger.debug("debug information");

const app = express();
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
  appLogger.info("Hello World");
  res.send('Hello World!')
});


process.on('SIGINT', function() {
  appLogger.notice("Caught interrupt signal");
  process.exit();
});


app.listen(port, () => {
  appLogger.notice(`Example app listening at http://localhost:${port}`);
  throw new Error('errorrrrr~');
});
