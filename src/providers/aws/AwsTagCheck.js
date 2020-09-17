const assert = require("assert");
const { KeyName } = require("./AwsCommon");

exports.CheckTagsEC2 = ({ config, tags, name }) => {
  const { managedByKey, managedByValue, stageTagKey, stage } = config;
  assert(tags);
  assert(name);
  assert.equal(
    tags.find((tag) => tag.Key === managedByKey).Value,
    managedByValue
  );
  assert.equal(tags.find((tag) => tag.Key === KeyName).Value, name);
  assert.equal(tags.find((tag) => tag.Key === stageTagKey).Value, stage);
};

exports.CheckTagsS3 = ({ config, tags, name }) => {
  const { managedByKey, managedByValue, stageTagKey, stage } = config;

  assert.equal(
    tags.find((tag) => tag.Key === managedByKey).Value,
    managedByValue
  );
  assert.equal(tags.find((tag) => tag.Key === stageTagKey).Value, stage);
};
