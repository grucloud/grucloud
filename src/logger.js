const { createLogger, format, transports } = require("winston");
const fs = require("fs");

const transportFiles = [
  {
    filename: "grucloud-debug.log",
    level: "debug",
    format: format.combine(
      format.timestamp({ format: "HH:mm:ss.SSS" }),
      format.printf(
        (info) =>
          `${info.timestamp} ${info.level}: ${info.message}` +
          (info.splat !== undefined ? `${info.splat}` : " ")
      )
    ),
  },
];

transportFiles.forEach((item) => {
  try {
    fs.unlinkSync(item.filename);
  } catch (error) {}
});

const logger = createLogger({
  level: "debug",
  format: format.combine(format.splat(), format.simple()),
  transports: transportFiles.map((item) => new transports.File(item)),
});

module.exports = ({ prefix = "" }) => {
  return {
    logger,
    error: (...args) => logger.error(`${prefix} ${args}`),
    info: (...args) => logger.info(`${prefix} ${args}`),
    debug: (...args) => logger.debug(`${prefix} ${args}`),
  };
};
