const logger = require("../../../logger")({ prefix: "IamTags" });
const assert = require("assert");
const { tos } = require("../../../tos");

// TODO common with EC2 ?
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
