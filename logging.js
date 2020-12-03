const opentelemetry = require('@opentelemetry/api');
const winston = require('winston');
const { format } = winston;
const { combine, json, simple, colorize, timestamp } = format;

// how to use:
// const { getLogger } = require('@teracyhq-incubator/logging-tracing');
// const logger = getLogger('my category');
// logger.info('information message'); // etc

// Set logging level by env var: LOGGING_LEVEL=debug|info|notice|...
const LEVELS = {
  emerg: 0,  // One or more systems are unusable.
  alert: 1,  // A person must take an action immediately.
  crit: 2,   // Critical events cause more severe problems or outages.
  error: 3,  // Error events are likely to cause problems.
  warn: 4,   // Warning events might cause problems.
  notice: 5, // Normal but significant events, such as start up, shut down, or a configuration change
  info: 6,   // Routine information, such as ongoing status or performance.
  debug: 7   // Debug or trace information
};


// logging level to severity map (useful for google cloud logging)
// see: https://cloud.google.com/logging/docs/reference/v2/rest/v2/LogEntry#logseverity
const SEVERITIES = {
  emerg: "EMERGENCY",
  alert: "ALERT",
  crit: "CRITICAL",
  error: "ERROR",
  warn: "WARNING",
  notice: "NOTICE",
  info: "INFO",
  debug: "DEBUG"
};

const LOGGING_LEVEL = (function() {
  let loggingLevel = process.env.LOGGING_LEVEL || "info";
  if (SEVERITIES[loggingLevel] !== "") { // check that LOGGING_LEVEL must match the defined levels
    return loggingLevel;
  } else {
    return "info";
  }
})();

function gcloudFormatter(category) {
  return (info, opts) =>  {
    info.category = category;
    if (process.env.NODE_ENV == 'production') {
      info.severity = SEVERITIES[info.level] || "DEFAULT";
      delete info.level;
    }
    return info;
  }
}

// add tracing info to log entry if available
function tracingFormatter(info, opts) {
  let activeSpan = opentelemetry.getActiveSpan(opentelemetry.context.active());
  if (activeSpan) {
    let spanContext = activeSpan.spanContext;
    if (!!process.env.GCP_PROJECT_ID) {
      // TODO(hoatle): this did not work out of the box on GCP Tracing, so we need to find a way
      // to configure the fluent-bit to create the right log entry format
      info.trace = `projects/${process.env.GCP_PROJECT_ID}/traces/${spanContext.traceId}`;
    }

    // follow https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/logs/overview.md#json-formats
    info.traceid = spanContext.traceId;
    info.spanid = spanContext.spanId;
  }
  return info;
}

// get the format option
function getFormat(category) {
  if (process.env.NODE_ENV !== 'production') {
    return combine(
      format(gcloudFormatter(category))(),
      format(tracingFormatter)(),
      timestamp(),
      colorize(),
      simple(),
    );
  } else {
    return combine(
      format(gcloudFormatter(category))(),
      format(tracingFormatter)(),
      timestamp(),
      json()
    );
  }
}

//TODO(hoatle): mask, filter private info (PII) from the logs

const DEFAULT_FORMAT = getFormat("default");

// defaut logger configuration for exceptions/ rejections handling
winston.configure({
  levels: LEVELS,
  format: DEFAULT_FORMAT,
  transports: [
    new winston.transports.Console({
      level: LOGGING_LEVEL,
      handleExceptions: true,
      handleRejections: true
    })
  ],
  exitOnError: false // or true?
});

// colorize to resemble google cloud logging level colors
const COLORS = {
  emerg: 'red yellowBG',
  alert: 'underline red',
  crit: 'red whiteBG',
  error: 'red',
  warn: 'yellow',
  notice: 'cyan',
  info: 'blue',
  debug: 'green'
};

winston.addColors(COLORS);

// get or create logger by its category name
exports.getLogger = function(category) {
  // default options for all loggers
  let opts = {
    levels: LEVELS,
    format: getFormat(category),
    transports: [
      new winston.transports.Console({
        level: LOGGING_LEVEL
      })
    ]
  };

  return winston.loggers.get(category, opts);
}
