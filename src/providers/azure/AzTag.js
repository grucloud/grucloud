const assert = require("assert");
const logger = require("../../logger")({ prefix: "AzTag" });
const { tos } = require("../../tos");
exports.isOurMinion = ({ resource, config }) => {
  //logger.info(`isOurMinion ? ${tos({ config, resource })}`);
  const { managedByKey, managedByValue } = config;
  assert(managedByKey);
  const { tags = {} } = resource;

  const isGruLabel = (key, value) =>
    key === managedByKey && value === managedByValue;

  const isMinion = !!Object.keys(tags).some((key) =>
    isGruLabel(key, tags[key])
  );

  logger.debug(`isOurMinion isMinion: ${isMinion}`);
  return isMinion;
};
