const logger = require("../../logger")({ prefix: "AwsTags" });
const assert = require("assert");
const toString = (x) => JSON.stringify(x, null, 4);

exports.toTagName = (name, tag) => `${name}${tag}`;

exports.isOurMinion = ({ resource, tag: ourTag }) => {
  assert(resource);
  assert(resource.Tags);
  let minion = false;
  if (resource.Tags.find((tag) => tag.Key === ourTag)) {
    minion = true;
  } else if (resource.Description?.includes(ourTag)) {
    minion = true;
  }
  logger.info(`isOurMinion ${minion} ${toString({ ourTag, resource })}`);
  return minion;
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
