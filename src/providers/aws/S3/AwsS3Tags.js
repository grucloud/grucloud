const assert = require("assert");
const logger = require("../../../logger")({ prefix: "AwsTags" });
const { tos } = require("../../../tos");

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
