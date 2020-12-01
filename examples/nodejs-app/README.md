# nodejs-app


## Getting started


```bash
$ npm install
$ TRACE_EXPORTER=CONSOLE_SPAN node -r ./tracing.js app.js
info: tracing is initializing with opts: {"provider":{"plugins":{"http":{"enabled":true,"path":"@opentelemetry/plugin-http"},"https":{"enabled":true,"path":"@opentelemetry/plugin-https"},"express":{"enabled":true,"path":"@opentelemetry/plugin-express"}}},"exporter":{},"register":{},"category":"logging-tracing:tracing","timestamp":"2020-12-01T03:34:23.237Z"}
info: tracing with CONSOLE_SPAN exporter {"category":"logging-tracing:tracing","timestamp":"2020-12-01T03:34:23.245Z"}
info: tracing with SimpleSpanProcessor processor {"category":"logging-tracing:tracing","timestamp":"2020-12-01T03:34:23.245Z"}
Some modules (@grpc/grpc-js) were already required when their respective plugin was loaded, some plugins might not work. Make sure the SDK is setup before you require in other modules.
notice: tracing is initialized {"category":"logging-tracing:tracing","timestamp":"2020-12-01T03:34:25.272Z"}
PluginLoader#load: trying to load http@15.0.1
PluginLoader#load: trying to load express@4.17.1
PluginLoader#load: trying to load https@15.0.1
info: logging to console transports {"category":"category:1","timestamp":"2020-12-01T03:34:25.940Z"}
error: error now!!! {"category":"category:1","timestamp":"2020-12-01T03:34:25.941Z"}
crit: critical now!! {"category":"category:1","timestamp":"2020-12-01T03:34:25.942Z"}
warning: warning from the app {"category":"category:1","timestamp":"2020-12-01T03:34:25.942Z"}
crit: very critical now, fix it asap!!! {"category":"category:1","timestamp":"2020-12-01T03:34:25.942Z"}
alert: someone needs to fix this problem asap!!! {"category":"category:1","timestamp":"2020-12-01T03:34:25.943Z"}
emerg: emergency, the system is crashed!!! {"category":"category:1","timestamp":"2020-12-01T03:34:25.943Z"}
error: Error here from logger2 {"category":"category:2","timestamp":"2020-12-01T03:34:25.943Z"}
notice: Example app listening at http://localhost:3000 {"category":"category:1","timestamp":"2020-12-01T03:34:25.959Z"}
error: uncaughtException: errorrrrr~
Error: errorrrrr~
    at Server.<anonymous> (/Users/hoatle/teracy-dev/workspace/logging-tracing/examples/nodejs-app/app.js:57:9)
    at Object.onceWrapper (node:events:433:28)
    at Server.emit (node:events:327:20)
    at Server.incomingRequest (/Users/hoatle/teracy-dev/workspace/logging-tracing/examples/nodejs-app/node_modules/@opentelemetry/plugin-http/build/src/http.js:175:33)
    at emitListeningNT (node:net:1320:10)
    at processTicksAndRejections (node:internal/process/task_queues:79:21) {"error":{},"stack":"Error: errorrrrr~\n    at Server.<anonymous> (/Users/hoatle/teracy-dev/workspace/logging-tracing/examples/nodejs-app/app.js:57:9)\n    at Object.onceWrapper (node:events:433:28)\n    at Server.emit (node:events:327:20)\n    at Server.incomingRequest (/Users/hoatle/teracy-dev/workspace/logging-tracing/examples/nodejs-app/node_modules/@opentelemetry/plugin-http/build/src/http.js:175:33)\n    at emitListeningNT (node:net:1320:10)\n    at processTicksAndRejections (node:internal/process/task_queues:79:21)","exception":true,"date":"Tue Dec 01 2020 10:34:25 GMT+0700 (Indochina Time)","process":{"pid":73306,"uid":501,"gid":20,"cwd":"/Users/hoatle/teracy-dev/workspace/logging-tracing/examples/nodejs-app","execPath":"/usr/local/Cellar/node/15.0.1/bin/node","version":"v15.0.1","argv":["/usr/local/Cellar/node/15.0.1/bin/node","/Users/hoatle/teracy-dev/workspace/logging-tracing/examples/nodejs-app/app.js"],"memoryUsage":{"rss":60448768,"heapTotal":32681984,"heapUsed":21280120,"external":1537605,"arrayBuffers":401588}},"os":{"loadavg":[11.59375,10.22802734375,8.2255859375],"uptime":905443},"trace":[{"column":9,"file":"/Users/hoatle/teracy-dev/workspace/logging-tracing/examples/nodejs-app/app.js","function":null,"line":57,"method":null,"native":false},{"column":28,"file":"node:events","function":"Object.onceWrapper","line":433,"method":"onceWrapper","native":false},{"column":20,"file":"node:events","function":"Server.emit","line":327,"method":"emit","native":false},{"column":33,"file":"/Users/hoatle/teracy-dev/workspace/logging-tracing/examples/nodejs-app/node_modules/@opentelemetry/plugin-http/build/src/http.js","function":"Server.incomingRequest","line":175,"method":"incomingRequest","native":false},{"column":10,"file":"node:net","function":"emitListeningNT","line":1320,"method":null,"native":false},{"column":21,"file":"node:internal/process/task_queues","function":"processTicksAndRejections","line":79,"method":null,"native":false}],"category":"default","timestamp":"2020-12-01T03:34:25.969Z"}
```


Open http://localhost:3000 to see the tracing with associated logs:

```bash
{
  traceId: '98d72c9ef890b018d9b5c7735ac610f7',
  parentId: 'bb8fba916c02b118',
  name: 'middleware - query',
  id: '9a99c233b8035af0',
  kind: 0,
  timestamp: 1606793695932638,
  duration: 524,
  attributes: {
    component: 'express',
    'express.name': 'query',
    'express.type': 'middleware'
  },
  status: { code: 0 },
  events: []
}
{
  traceId: '98d72c9ef890b018d9b5c7735ac610f7',
  parentId: 'bb8fba916c02b118',
  name: 'middleware - expressInit',
  id: '4a0636d190c648c5',
  kind: 0,
  timestamp: 1606793695946768,
  duration: 1212,
  attributes: {
    component: 'express',
    'express.name': 'expressInit',
    'express.type': 'middleware'
  },
  status: { code: 0 },
  events: []
}
{
  traceId: '98d72c9ef890b018d9b5c7735ac610f7',
  parentId: 'bb8fba916c02b118',
  name: 'request handler - /',
  id: 'acaaecec480088e8',
  kind: 0,
  timestamp: 1606793695949808,
  duration: 160,
  attributes: {
    component: 'express',
    'express.name': '/',
    'express.type': 'request_handler'
  },
  status: { code: 0 },
  events: []
}
info: Hello World {"category":"category:1","traceId":"98d72c9ef890b018d9b5c7735ac610f7","spanId":"bb8fba916c02b118","timestamp":"2020-12-01T03:34:55.962Z"}
{
  traceId: '98d72c9ef890b018d9b5c7735ac610f7',
  parentId: undefined,
  name: 'GET ',
  id: 'bb8fba916c02b118',
  kind: 1,
  timestamp: 1606793695928687,
  duration: 37724,
  attributes: {
    'http.url': 'http://localhost:3000/',
    'http.host': 'localhost:3000',
    'net.host.name': 'localhost',
    'http.method': 'GET',
    'http.route': '',
    'http.target': '/',
    'http.user_agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    'http.flavor': '1.1',
    'net.transport': 'IP.TCP',
    'net.host.ip': '::1',
    'net.host.port': 3000,
    'net.peer.ip': '::1',
    'net.peer.port': 52063,
    'http.status_code': 200,
    'http.status_text': 'OK'
  },
  status: { code: 0 },
  events: []
}
{
  traceId: 'a3f2cb072cb2fe68f19964fdf2d8c65f',
  parentId: '9b209affbb2bbed0',
  name: 'middleware - query',
  id: '1294d023a90baa92',
  kind: 0,
  timestamp: 1606793697293873,
  duration: 88,
  attributes: {
    component: 'express',
    'express.name': 'query',
    'express.type': 'middleware'
  },
  status: { code: 0 },
  events: []
}
{
  traceId: 'a3f2cb072cb2fe68f19964fdf2d8c65f',
  parentId: '9b209affbb2bbed0',
  name: 'middleware - expressInit',
  id: 'ceac38ea8e67d3d3',
  kind: 0,
  timestamp: 1606793697294616,
  duration: 82,
  attributes: {
    component: 'express',
    'express.name': 'expressInit',
    'express.type': 'middleware'
  },
  status: { code: 0 },
  events: []
}
{
  traceId: 'a3f2cb072cb2fe68f19964fdf2d8c65f',
  parentId: undefined,
  name: 'HTTP GET',
  id: '9b209affbb2bbed0',
  kind: 1,
  timestamp: 1606793697293591,
  duration: 4174,
  attributes: {
    'http.url': 'http://localhost:3000/favicon.ico',
    'http.host': 'localhost:3000',
    'net.host.name': 'localhost',
    'http.method': 'GET',
    'http.route': '',
    'http.target': '/favicon.ico',
    'http.user_agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
    'http.flavor': '1.1',
    'net.transport': 'IP.TCP',
    'net.host.ip': '::1',
    'net.host.port': 3000,
    'net.peer.ip': '::1',
    'net.peer.port': 52063,
    'http.status_code': 404,
    'http.status_text': 'NOT FOUND'
  },
  status: { code: 5 },
  events: []
}

```