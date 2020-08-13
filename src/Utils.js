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
const compareObject = ({ target = {}, live = {} }) => {
  //console.log(target, live);

  const diff = pipe([
    map((targetValue, targetKey) => {
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
    }),
    filter((x) => x),
  ])(target);
  return diff.length > 0 ? diff : undefined;
};
exports.compareObject = compareObject;

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
