const { createLogger, format, transports } = require("winston");
const fs = require("fs");

const transportFiles = [
  {
    filename: "grucloud-debug.log",
    level: "debug",
    format: format.simple(),
  },
  {
    filename: "grucloud-info.log",
    level: "info",
    format: format.simple(),
  },
];

transportFiles.forEach((item) => fs.unlinkSync(item.filename));

const logger = createLogger({
  level: "debug",
  format: format.combine(format.splat(), format.simple()),
  transports: transportFiles.map((item) => new transports.File(item)),
});

module.exports = ({ prefix = "" }) => {
  return {
    logger,
    error: (...args) => logger.error(args),
    info: (...args) => logger.info(...args),
    debug: (...args) => logger.debug(...args),
  };
};
