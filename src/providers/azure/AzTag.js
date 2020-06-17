const assert = require("assert");
const _ = require("lodash");
const logger = require("../../logger")({ prefix: "AzTag" });
const toString = (x) => JSON.stringify(x, null, 4);

exports.isOurMinion = ({ resource, config }) => {
  //logger.info(`isOurMinion ? ${toString({ config, resource })}`);
  const { managedByKey, managedByValue } = config;
  assert(managedByKey);
  const { tags = {} } = resource;

  const isGruLabel = (key, value) =>
    key === managedByKey && value === managedByValue;

  const isMinion = !!_.find(tags, (value, key) => isGruLabel(key, value));

  logger.info(
    `isOurMinion isMinion: ${isMinion}, ${toString({ config, resource })}`
  );
  return isMinion;
};
