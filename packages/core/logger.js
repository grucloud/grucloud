const LoggerBrowser = ({ prefix }) => {
  return {
    logger: { end: () => {} },
    error: (...args) => console.error(`${prefix.padEnd(12, " ")} ${args}`),
    info: (...args) => console.log(`${prefix.padEnd(12, " ")} ${args}`),
    debug: (...args) => console.log(`${prefix.padEnd(12, " ")} ${args}`),
  };
};

const isBrowser = () => typeof window !== `undefined`;

module.exports = ({ prefix = "" }) => {
  if (isBrowser()) {
    return LoggerBrowser({ prefix });
  } else {
    //return LoggerBrowser({ prefix });
    return require("./loggerNode")({ prefix });
  }
};
