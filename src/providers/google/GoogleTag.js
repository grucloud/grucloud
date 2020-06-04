const assert = require("assert");
const _ = require("lodash");
const logger = require("../../logger")({ prefix: "GoogleTag" });
const toString = (x) => JSON.stringify(x, null, 4);
const hasTag = (name = "", tag) => name && name.includes(tag);

exports.toTagName = (name, tag) => `${name}${tag}`;
exports.fromTagName = (name, tag) => name && name.replace(tag, "");
exports.hasTag = hasTag;

exports.isOurMinion = ({ resource, config }) => {
  logger.info(`isOurMinion ? ${toString({ config, resource })}`);
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
    logger.error(`isOurMinion no labels or description`);
  }

  logger.info(
    `isOurMinion isMinion: ${isMinion}, ${toString({ config, resource })}`
  );
  return isMinion;
};
