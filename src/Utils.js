const assert = require("assert");
const { isEmpty, isEqual, isObject, get, map } = require("lodash");
const logger = require("./logger")({ prefix: "MocCloud" });
const toString = (x) => JSON.stringify(x, null, 4);

exports.checkConfig = (config, mandatoryConfigKeys = []) => {
  const missingKeys = mandatoryConfigKeys.filter((key) => !config[key]);
  const { CONFIG_ENV = "dev" } = process.env;

  if (!isEmpty(missingKeys)) {
    throw Error(
      `${missingKeys.join(
        ","
      )} are missing from the config files "config/default.json" or "config/${CONFIG_ENV}.json" `
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
  logger.debug(`compare ${toString({ target, targetKeys, live })}`);

  const targetDiff = targetKeys
    .map((targetKey) => {
      const targetValue = get(target, targetKey);
      const liveValue = get(live, targetKey);

      logger.debug(
        `compare for targetKey: ${toString({
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

  logger.info(`compare ${toString({ targetDiff })}`);
  return targetDiff;
};
