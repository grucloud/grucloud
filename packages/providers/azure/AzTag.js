const assert = require("assert");
const logger = require("@grucloud/core/logger")({ prefix: "AzTag" });
const { tos } = require("@grucloud/core/tos");
exports.isOurMinion = ({ live, config }) => {
  //logger.info(`isOurMinion ? ${tos({ config, resource })}`);
  const { managedByKey, managedByValue } = config;
  assert(managedByKey);
  const { tags = {} } = live;

  const isGruLabel = (key, value) =>
    key === managedByKey && value === managedByValue;

  const isMinion = !!Object.keys(tags).some((key) =>
    isGruLabel(key, tags[key])
  );

  logger.debug(`isOurMinion isMinion: ${isMinion}`);
  return isMinion;
};
