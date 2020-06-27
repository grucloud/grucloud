const assert = require("assert");
const _ = require("lodash");
const logger = require("../../logger")({ prefix: "GoogleTag" });
const { tos } = require("../../tos");
const hasTag = (name = "", tag) => name && name.includes(tag);

exports.hasTag = hasTag;

exports.toTagName = (name, tag) => `${name}${tag}`;

exports.isOurMinion = ({ resource, config }) => {
  logger.info(`isOurMinion ? ${tos({ config, resource })}`);
  const { managedByKey, managedByValue, managedByDescription } = config;
  assert(managedByKey);
  const { labels = {}, description } = resource;
  let isMinion = false;

  const isGruLabel = (key, value) =>
    key === managedByKey && value === managedByValue;

  if (hasTag(description, managedByDescription)) {
    logger.info(`isOurMinion yes, same description`);
    isMinion = true;
  } else if (_.find(labels, (value, key) => isGruLabel(key, value))) {
    logger.info(`isOurMinion yes, from single label`);
    isMinion = true;
  } else {
    logger.info(`isOurMinion no labels or description`);
  }

  logger.info(
    `isOurMinion isMinion: ${isMinion}, ${tos({ config, resource })}`
  );
  return isMinion;
};
