const assert = require("assert");
const { isEmpty } = require("rubico/x");

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
//TODO do we need this ?
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
