const assert = require("assert");
const { isEmpty, isObject, isDeepEqual } = require("rubico/x");
const { get, map, pipe, filter } = require("rubico");
const logger = require("./logger")({ prefix: "MocCloud" });
const { tos } = require("./tos");

exports.checkEnv = (mandatoryEnv = []) => {
  const missingEnv = mandatoryEnv.filter((env) => !process.env[env]);
  const { CONFIG_ENV = "dev" } = process.env;

  if (!isEmpty(missingEnv)) {
    throw Error(
      `${missingEnv.join(
        ","
      )} is missing from the environment files "config/default.env" or "config/${CONFIG_ENV}.env" `
    );
  }
};

exports.checkConfig = (config, mandatoryConfigKeys = []) => {
  const missingKeys = mandatoryConfigKeys.filter((key) => !config[key]);
  const { CONFIG_ENV = "dev" } = process.env;

  if (!isEmpty(missingKeys)) {
    throw Error(
      `${missingKeys.join(
        ","
      )} is missing from the config files "config/default.js" or "config/${CONFIG_ENV}.js" `
    );
  }
};

exports.compare = ({ target = {}, targetKeys = [], live = {} }) => {
  logger.debug(`compare ${tos({ target, targetKeys, live })}`);

  const targetDiff = pipe([
    map((targetKey) => {
      const targetValue = get(targetKey)(target);
      const liveValue = get(targetKey)(live);

      logger.debug(
        `compare for targetKey: ${tos({
          targetKey,
          targetValue,
          liveValue,
        })}`
      );
      if (!liveValue) {
        return {
          key: targetKey,
          type: "NEW",
          targetValue,
          liveValue: undefined,
        };
      }

      if (!isDeepEqual(targetValue, liveValue)) {
        return {
          key: targetKey,
          type: "DIFF",
          targetValue,
          liveValue,
        };
      }
    }),
    filter((x) => x),
  ])(targetKeys);

  logger.info(`compare ${tos({ targetDiff })}`);
  return targetDiff;
};
exports.compareArray = ({ targets = [], lives = [] }) => {
  logger.debug(`compareArray ${tos({ targets, lives })}`);

  const newElements = pipe([
    map((target) => {
      if (!lives.find((live) => isDeepEqual(live, target))) {
        return {
          type: "NEW",
          target,
        };
      }
    }),
    filter((x) => x),
  ])(targets);
  // TODO check for deleted one
  logger.info(`compareArray ${tos({ newElements })}`);
  return newElements;
};
