const assert = require("assert");
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
  const { labels = [], description } = resource;
  let isMinion = false;

  if (hasTag(description, managedByDescription)) {
    logger.info(`isOurMinion yes, same description`);
    isMinion = true;
  } else if (labels.key === managedByKey && labels.value === managedByValue) {
    logger.info(`isOurMinion yes, from single label`);
    isMinion = true;
  } else {
    isMinion = labels.find(
      (label) => label.key === managedByKey && label.value === managedByValue
    );
  }

  logger.info(
    `isOurMinion isMinion: ${isMinion}, ${toString({ config, resource })}`
  );
  return isMinion;
};
