const logger = require("../../logger")({ prefix: "AwsTags" });
const assert = require("assert");
const toString = (x) => JSON.stringify(x, null, 4);

exports.isOurMinion = ({ resource, config }) => {
  const { managedByKey, managedByValue, managedByDescription } = config;
  assert(resource);
  assert(resource.Tags);

  let minion = false;
  if (
    resource.Tags.find(
      (tag) => tag.Key === managedByKey && tag.Value === managedByValue
    )
  ) {
    minion = true;
  } else if (resource.Description?.includes(managedByDescription)) {
    minion = true;
  }
  logger.debug(
    `isOurMinion ${toString({
      minion,
      resource,
    })}`
  );
  return minion;
};

exports.isOurMinionEc2 = ({ resource, config }) => {
  const { managedByKey, managedByValue } = config;
  assert(resource);
  assert(resource.Instances);
  const isMinion = resource.Instances.some((instance) =>
    instance.Tags.find(
      (tag) => tag.Key === managedByKey && tag.Value === managedByValue
    )
  );

  logger.debug(
    `isOurMinion ec2: ${toString({
      isMinion,
      resource,
    })}`
  );
  return isMinion;
};
