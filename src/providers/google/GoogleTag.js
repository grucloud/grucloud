const logger = require("../../logger")({ prefix: "GoogleTag" });
const toString = (x) => JSON.stringify(x, null, 4);
const hasTag = (name = "", tag) => name && name.includes(tag);
exports.toTagName = (name, tag) => `${name}${tag}`;
exports.fromTagName = (name, tag) => name && name.replace(tag, "");
exports.hasTag = hasTag;

exports.isOurMinion = ({ resource, tag: ourTag }) => {
  logger.info(`isOurMinion ? ${toString({ ourTag, resource })}`);
  //TODO check everything here
  if (hasTag(resource.name, ourTag)) {
    logger.info(`isOurMinion yes, same resource name`);
    return true;
  }
  if (hasTag(resource.description, ourTag)) {
    logger.info(`isOurMinion yes, same description`);
    return true;
  }

  const { tags, labels } = resource;
  if (Array.isArray(tags?.items)) {
    if (tags?.items.some((tag) => tag.includes(ourTag))) {
      return true;
    }
  }
  if (Array.isArray(tags)) {
    if (tags.some((tag) => tag.includes(ourTag))) {
      return true;
    }
  }
  // TODO check labels ?
  if (labels) {
  }

  logger.info(`isOurMinion not our minion: ${toString({ ourTag, resource })}`);
};
