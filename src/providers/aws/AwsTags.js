const logger = require("../../logger")({ prefix: "AwsTags" });
const assert = require("assert");
const toString = (x) => JSON.stringify(x, null, 4);

exports.toTagName = (name, tag) => `${name}${tag}`;

exports.isOurMinion = ({ resource, tag: ourTag }) => {
  logger.info(`isOurMinion ? ${toString({ ourTag, resource })}`);
  assert(resource);
  assert(resource.Tags);
  if (resource.Tags.find((tag) => tag.Key === ourTag)) {
    return true;
  }
  if (resource.Description?.includes(ourTag)) {
    return true;
  }
  return false;
};

exports.isOurMinionEc2 = ({ resource, tag: ourTag }) => {
  logger.info(`isOurMinion ? ${toString({ ourTag, resource })}`);
  assert(resource);
  assert(resource.Instances);
  const hasTag = resource.Instances.some((instance) =>
    instance.Tags.find((tag) => tag.Key === ourTag)
  );

  logger.info(`isOurMinion: ${hasTag}`);
  return hasTag;
};
