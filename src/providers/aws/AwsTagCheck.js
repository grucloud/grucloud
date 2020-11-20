const assert = require("assert");
const { KeyName } = require("./AwsCommon");

exports.CheckAwsTags = ({ config, tags, name }) => {
  const {
    managedByKey,
    managedByValue,
    stageTagKey,
    stage,
    createdByProviderKey,
    providerName,
  } = config;
  assert(tags);

  assert.equal(
    tags.find((tag) => tag.Key === managedByKey).Value,
    managedByValue
  );
  assert(name);
  //assert.equal(tags.find((tag) => tag.Key === KeyName).Value, name);
  assert.equal(tags.find((tag) => tag.Key === stageTagKey).Value, stage);
  assert.equal(
    tags.find((tag) => tag.Key === createdByProviderKey).Value,
    providerName
  );
};
