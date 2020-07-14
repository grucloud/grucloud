const logger = require("../../logger")({ prefix: "CoreClient" });
const { tos } = require("../../tos");
const { hasTag } = require("../TagName");

exports.isOurMinion = ({ resource, config }) => {
  //logger.info(`isOurMinion ? ${tos({ ourTag, resource })}`);
  if (hasTag(resource.name, config.tag)) {
    logger.info(`isOurMinion yes, same resource name`);
    return true;
  }
  if (hasTag(resource.description, config.tag)) {
    logger.info(`isOurMinion yes, same description`);
    return true;
  }

  const { tags } = resource;
  if (Array.isArray(tags?.items)) {
    if (tags?.items.some((tag) => tag.includes(config.tag))) {
      logger.info(`isOurMinion yes, tags?.items`);
      return true;
    }
  }
  if (Array.isArray(tags)) {
    if (tags.some((tag) => tag.includes(config.tag))) {
      return true;
    }
  }

  logger.info(`isOurMinion not our minion: ${tos({ resource })}`);
};
