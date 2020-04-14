const _ = require("lodash");
const checkEnvironment = (env = []) =>
  env.forEach((env) => {
    //console.log(env);
    if (!process.env[env]) {
      throw new Error(`Please set the environment variable ${env}`);
    }
  });

const compare = (target, live) => {
  console.log("compare", { target, live });
  var targetKeys = Object.getOwnPropertyNames(target);
  var liveKeys = Object.getOwnPropertyNames(live);
  console.log("compare", { targetKeys, liveKeys });

  const targetDiff = Object.getOwnPropertyNames(target)
    .map((targetKey) => {
      if (liveKeys.includes(targetKey)) {
        //very bad, much buggy
        //if object, recursive ?
        const targetValue = target[targetKey];
        const liveValue = live[targetKey];
        console.log("compare ", { targetValue, liveValue });
        if (targetValue !== liveValue) {
          return {
            key: targetKey,
            targetValue: target[targetKey],
            liveValue: live[targetKey],
          };
        }
      } else {
        return {
          key: targetKey,
          targetValue: target[targetKey],
          liveValue: undefined,
        };
      }
    })
    .filter((x) => x);
  console.log("compare ", { targetDiff });
  return targetDiff || [];
};

module.exports = {
  compare,
  checkEnvironment,
};
