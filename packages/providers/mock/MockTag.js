const logger = require("@grucloud/core/logger")({ prefix: "CoreClient" });
const { tos } = require("@grucloud/core/tos");
const { hasTag } = require("@grucloud/core/TagName");

exports.isOurMinion = ({ resource, config }) => {
  //logger.info(`isOurMinion ? ${tos({ ourTag, resource })}`);
  if (hasTag(resource.name, config.tag)) {
    logger.debug(`isOurMinion yes, same resource name`);
    return true;
  }
  if (hasTag(resource.description, config.tag)) {
    logger.debug(`isOurMinion yes, same description`);
    return true;
  }

  const { tags } = resource;
  if (Array.isArray(tags?.items)) {
    if (tags?.items.some((tag) => tag.includes(config.tag))) {
      logger.debug(`isOurMinion yes, tags?.items`);
      return true;
    }
  }
  if (Array.isArray(tags)) {
    if (tags.some((tag) => tag.includes(config.tag))) {
      return true;
    }
  }

  logger.debug(`isOurMinion not our minion: ${tos({ resource })}`);
};
