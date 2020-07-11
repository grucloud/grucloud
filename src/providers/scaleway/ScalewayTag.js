const logger = require("../../logger")({ prefix: "ScwTag" });
const { tos } = require("../../tos");
const { hasTag } = require("../TagName");

exports.isOurMinion = ({ resource, tag: ourTag }) => {
  //logger.info(`isOurMinion ? ${tos({ ourTag, resource })}`);
  if (hasTag(resource.name, ourTag)) {
    logger.info(`isOurMinion yes, same resource name`);
    return true;
  }
  if (hasTag(resource.description, ourTag)) {
    logger.info(`isOurMinion yes, same description`);
    return true;
  }

  const { tags } = resource;
  if (Array.isArray(tags?.items)) {
    if (tags?.items.some((tag) => tag.includes(ourTag))) {
      logger.info(`isOurMinion yes, tags?.items`);
      return true;
    }
  }
  if (Array.isArray(tags)) {
    if (tags.some((tag) => tag.includes(ourTag))) {
      return true;
    }
  }

  logger.info(`isOurMinion not our minion: ${tos({ ourTag, resource })}`);
};
