const _ = require("lodash");
const logger = require("logger")({ prefix: "MocCloud" });
const toString = (x) => JSON.stringify(x, null, 4);

const checkEnvironment = (env = []) =>
  env.forEach((env) => {
    //console.log(env);
    if (!process.env[env]) {
      throw new Error(`Please set the environment variable ${env}`);
    }
  });

const compare = (target = {}, live = {}) => {
  logger.info(`compare ${toString({ target, live })}`);

  var liveKeys = Object.getOwnPropertyNames(live);

  const targetDiff = Object.getOwnPropertyNames(target)
    .map((targetKey) => {
      if (liveKeys.includes(targetKey)) {
        const targetValue = target[targetKey];
        const liveValue = live[targetKey];
        if (!_.isEqual(targetValue, liveValue)) {
          return {
            key: targetKey,
            type: "DIFF",
            targetValue: target[targetKey],
            liveValue: live[targetKey],
          };
        }
      } else {
        return {
          key: targetKey,
          type: "NEW",
          targetValue: target[targetKey],
          liveValue: undefined,
        };
      }
    })
    .filter((x) => x);

  logger.info(`compare ${toString({ targetDiff })}`);
  return targetDiff || [];
};

module.exports = {
  compare,
  checkEnvironment,
};
