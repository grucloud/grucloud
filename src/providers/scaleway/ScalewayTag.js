const logger = require("../../logger")({ prefix: "ScwTag" });
const { tos } = require("../../tos");
const { hasTag } = require("../TagName");

exports.isOurMinion = ({ resource, tag: ourTag }) => {
  if (hasTag(resource.name, ourTag)) {
    logger.debug(`isOurMinion yes, same resource name`);
    return true;
  }
  if (hasTag(resource.description, ourTag)) {
    logger.debug(`isOurMinion yes, same description`);
    return true;
  }

  const { tags } = resource;
  if (Array.isArray(tags?.items)) {
    if (tags?.items.some((tag) => tag.includes(ourTag))) {
      logger.debug(`isOurMinion yes, tags?.items`);
      return true;
    }
  }
  if (Array.isArray(tags)) {
    if (tags.some((tag) => tag.includes(ourTag))) {
      return true;
    }
  }

  logger.debug(`isOurMinion not our minion: ${tos({ ourTag, resource })}`);
};
