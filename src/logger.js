//const logger = require("pino")({ prettyPrint: true, level: "debug" });
const { createLogger, format, transports } = require("winston");
const logger = createLogger({
  level: "debug",
  format: format.combine(format.splat(), format.simple()),
  //defaultMeta: { service: "user-service" },
  transports: [
    new transports.File({
      filename: "grucloud-debug.log",
      level: "debug",
      format: format.simple(),
    }),
    new transports.File({
      filename: "grucloud-info.log",
      level: "info",
      format: format.simple(),
    }),
    new transports.Console({
      format: format.simple(),
    }),
  ],
});

module.exports = ({ prefix = "" }) => {
  return {
    logger,
    error: (...args) => logger.error(args),
    info: (...args) => logger.info(...args),
    debug: (...args) => logger.debug(...args),
  };
};
