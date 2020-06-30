const assert = require("assert");
const _ = require("lodash");
const { switchCase } = require("rubico");
const logger = require("../../logger")({ prefix: "GoogleTag" });
const { tos } = require("../../tos");
const { hasTag } = require("../TagName");

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
    () => _.find(labels, (value, key) => isGruLabel(key, value)),
    () => true,
    () => false,
  ]);

  logger.info(`isOurMinion isMinion: ${isMinion}, ${tos({ resource })}`);
  return isMinion;
};
