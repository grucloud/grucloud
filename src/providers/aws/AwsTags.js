const logger = require("../../logger")({ prefix: "AwsTags" });
const assert = require("assert");
const toString = (x) => JSON.stringify(x, null, 4);

exports.isOurMinion = ({ resource, tag: ourTag }) => {
  logger.info(`isOurMinion ? ${toString({ ourTag, resource })}`);
  assert(resource);
  assert(resource.Instances);
  const hasTag = resource.Instances.some((instance) =>
    instance.Tags.find((tag) => tag.Key === ourTag)
  );

  logger.info(`isOurMinion: ${hasTag}`);
  return hasTag;
};
