const assert = require("assert");
const { isEmpty, isEqual, isObject, get, map } = require("lodash");
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
const compareObject = ({ target = {}, live = {} }) => {
  //console.log(target, live);

  const diff = map(target, (targetValue, targetKey) => {
    if (isObject(targetValue)) {
      return compareObject({ target: targetValue, live: live[targetKey] });
    }
    if (targetValue !== live[targetKey]) {
      return {
        key: targetKey,
        targetValue: targetValue,
        liveValue: live[targetKey],
      };
    }
  }).filter((x) => x);
  return diff.length > 0 ? diff : undefined;
};
exports.compareObject = compareObject;

exports.compare = ({ target = {}, targetKeys = [], live = {} }) => {
  logger.debug(`compare ${tos({ target, targetKeys, live })}`);

  const targetDiff = targetKeys
    .map((targetKey) => {
      const targetValue = get(target, targetKey);
      const liveValue = get(live, targetKey);

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

      if (!isEqual(targetValue, liveValue)) {
        return {
          key: targetKey,
          type: "DIFF",
          targetValue,
          liveValue,
        };
      }
    })
    .filter((x) => x);

  logger.info(`compare ${tos({ targetDiff })}`);
  return targetDiff;
};
