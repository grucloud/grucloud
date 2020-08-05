const assert = require("assert");
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
    () => Object.keys(labels).some((key) => isGruLabel(key, labels[key])),
    () => true,
    () => false,
  ])();

  logger.info(`isOurMinion: ${isMinion}`);
  return isMinion;
};
