const { createLogger, format, transports } = require("winston");
const fs = require("fs");

const transportFiles = [
  {
    filename: "mock-server-debug.log",
    level: "debug",
    format: format.simple(),
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
  transports: [
    new transports.Console(),
    ,
    ...transportFiles.map((item) => new transports.File(item)),
  ],
});

module.exports = ({ prefix = "" }) => {
  return logger;
};
