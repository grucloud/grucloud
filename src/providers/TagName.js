const logger = require("../logger")({ prefix: "CoreClient" });
const toString = (x) => JSON.stringify(x, null, 4);
const hasTag = (name = "", tag) => name && name.includes(tag);
exports.toTagName = (name, tag) => `${name}${tag}`;
exports.fromTagName = (name, tag) => name && name.replace(tag, "");
exports.hasTag = hasTag;

exports.isOurMinion = (resource, ourTag) => {
  logger.info(`isOurMinion ${toString({ ourTag, resource })}`);
  if (hasTag(resource.name, ourTag)) {
    return true;
  }
  if (hasTag(resource.description, ourTag)) {
    return true;
  }

  const { tags } = resource;
  if (tags) {
    if (Array.isArray(tags)) {
      return tags.some((tag) => tag.includes(ourTag));
    } else {
      //TODO could an object
      console.error("tags is not an array TODO");
    }
  }
  // TODO check labels ?
  logger.info(`isOurMinion not our minion: ${toString({ ourTag, resource })}`);
};
