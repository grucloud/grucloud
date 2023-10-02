const { createLogger, format, transports } = require("winston");
const fs = require("fs");

const formatTimestamp = format.combine(
  format.timestamp({ format: "HH:mm:ss.SSS" }),
  format.printf(
    (info) =>
      `${info.timestamp} ${info.level.padEnd(5, " ")}: ${info.message}` +
      (info.splat !== undefined ? `${info.splat}` : " ")
  )
);

const transportFiles = [
  {
    filename: "grucloud-error.log",
    level: "error",
    format: formatTimestamp,
  },
  {
    filename: "grucloud-info.log",
    level: "info",
    format: formatTimestamp,
  },
  {
    filename: "grucloud-debug.log",
    level: "debug",
    format: formatTimestamp,
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

if (process.env.CONTINUOUS_INTEGRATION) {
  logger.add(
    new transports.Console({
      level: "info",
      format: formatTimestamp,
    })
  );
}

logger.add(
  new transports.Console({
    level: "error",
    format: formatTimestamp,
  })
);
module.exports = ({ prefix = "" }) => {
  return {
    logger,
    error: (...args) => logger.error(`${prefix.padEnd(12, " ")} ${args}`),
    info: (...args) => logger.info(`${prefix.padEnd(12, " ")} ${args}`),
    debug: (...args) => logger.debug(`${prefix.padEnd(12, " ")} ${args}`),
  };
};
