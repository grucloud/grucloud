const logger = require("../../logger")({ prefix: "AwsTags" });
const assert = require("assert");
const { tos } = require("../../tos");
exports.isOurMinion = ({ resource, config }) => {
  const { managedByKey, managedByValue } = config;
  assert(resource);
  assert(resource.Tags);

  let minion = false;
  if (
    resource.Tags.find(
      (tag) => tag.Key === managedByKey && tag.Value === managedByValue
    )
  ) {
    minion = true;
  }

  logger.debug(
    `isOurMinion ${tos({
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
    `isOurMinion ec2: ${tos({
      isMinion,
      resource,
    })}`
  );
  return isMinion;
};

//TODO put it in AwsS3Bucket
exports.isOurMinionS3 = ({ resource, config }) => {
  const { managedByKey, managedByValue } = config;
  assert(resource);
  const isMinion = !!resource.TagSet?.find(
    (tag) => tag.Key === managedByKey && tag.Value === managedByValue
  );

  logger.debug(
    `isOurMinion s3: ${tos({
      isMinion,
      resource,
    })}`
  );
  return isMinion;
};
