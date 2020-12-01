// exports tracing and logging

const logging = require('./logging');
const tracing = require('./tracing');

exports.getLogger = logging.getLogger;

exports.initTracing = tracing.initTracing;
