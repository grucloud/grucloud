const assert = require("assert");
const logger = require("../../logger")({ prefix: "AwsCommon" });
const toString = (x) => JSON.stringify(x, null, 4);

const KeyName = "Name";
exports.KeyName = KeyName;

exports.findNameInTags = (item) => {
  assert(item);
  assert(item.Tags);
  const tag = item.Tags.find((tag) => tag.Key === KeyName);
  if (tag?.Value) {
    logger.debug(`findNameInTags ${toString({ name: tag.Value, item })}`);
    return tag.Value;
  } else {
    logger.error(`findNameInTags: cannot find name ${toString({ item })}`);
  }
};
