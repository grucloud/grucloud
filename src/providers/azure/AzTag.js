const assert = require("assert");
const _ = require("lodash");
const logger = require("../../logger")({ prefix: "AzTag" });
const { tos } = require("../../tos");
exports.isOurMinion = ({ resource, config }) => {
  //logger.info(`isOurMinion ? ${tos({ config, resource })}`);
  const { managedByKey, managedByValue } = config;
  assert(managedByKey);
  const { tags = {} } = resource;

  const isGruLabel = (key, value) =>
    key === managedByKey && value === managedByValue;

  const isMinion = !!_.find(tags, (value, key) => isGruLabel(key, value));

  logger.info(
    `isOurMinion isMinion: ${isMinion}, ${tos({ config, resource })}`
  );
  return isMinion;
};
