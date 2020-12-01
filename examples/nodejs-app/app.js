const express = require('express');
const promClient = require('prom-client')

const { getLogger } = require('logging-tracing');

promClient.collectDefaultMetrics()

const logger1 = getLogger("category:1")


logger1.info('logging to console transports');

logger1.error('error now!!!');
logger1.crit('critical now!!');

logger1.warning('warning from the app');
logger1.crit('very critical now, fix it asap!!!');
logger1.alert('someone needs to fix this problem asap!!!')
logger1.emerg('emergency, the system is crashed!!!');

const logger2 = getLogger("category:2");

logger2.error('Error here from logger2');

const app = express();
const port = 3000;


const counter = new promClient.Counter({
  name: 'my_metric_identifier',
  help: 'an example counter metric for this tutorial',
});


app.get('/', (req, res) => {
  logger1.info("Hello World");
  counter.inc();
  res.send('Hello World!')
});


app.get('/metrics', function (req, res) {
  res.send(
    promClient.register.metrics()
  )
})


process.on('SIGINT', function() {
  logger1.notice("Caught interrupt signal");
  process.exit();
});


app.listen(port, () => {
  logger1.notice(`Example app listening at http://localhost:${port}`);
  throw new Error('errorrrrr~');
});

