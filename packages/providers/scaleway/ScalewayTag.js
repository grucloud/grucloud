const logger = require("@grucloud/core/logger")({ prefix: "ScwTag" });
const { tos } = require("@grucloud/core/tos");
const { hasTag } = require("@grucloud/core/TagName");

exports.isOurMinion = ({ live, tag: ourTag }) => {
  if (hasTag(live.name, ourTag)) {
    logger.debug(`isOurMinion yes, same live name`);
    return true;
  }
  if (hasTag(live.description, ourTag)) {
    logger.debug(`isOurMinion yes, same description`);
    return true;
  }

  const { tags } = live;
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

  logger.debug(`isOurMinion not our minion: ${tos({ ourTag, live })}`);
};
