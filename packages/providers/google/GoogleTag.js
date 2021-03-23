const assert = require("assert");
const { switchCase } = require("rubico");
const logger = require("@grucloud/core/logger")({ prefix: "GoogleTag" });
const { tos } = require("@grucloud/core/tos");
const { hasTag } = require("@grucloud/core/TagName");

exports.isOurMinion = ({ resource, config }) => {
  //logger.info(`isOurMinion ? ${tos({ config, resource })}`);
  const { managedByKey, managedByValue, managedByDescription } = config;
  assert(managedByKey);
  const { labels = {}, description } = resource;

  const isGruLabel = (key, value) =>
    key === managedByKey && value === managedByValue;

  const isMinion = switchCase([
    () => hasTag(description, managedByDescription),
    () => true,
    () => Object.keys(labels).some((key) => isGruLabel(key, labels[key])),
    () => true,
    () => false,
  ])();

  logger.debug(`isOurMinion: ${isMinion}`);
  return isMinion;
};
