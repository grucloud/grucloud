const AWS = require("aws-sdk");
const assert = require("assert");
const { KeyName } = require("./AwsCommon");
const logger = require("../../logger")({ prefix: "AwsTagResource" });

exports.tagResource = async ({ config, resourceType, resourceId, name }) => {
  const {
    managedByKey,
    managedByValue,
    region,
    accountId,
    stageTagKey,
    stage,
  } = config;
  assert(region);
  assert(accountId);
  assert(stage);

  AWS.config.update({ region });
  const tagApi = new AWS.ResourceGroupsTaggingAPI();

  const arnId = `arn:aws:ec2:${region}:${accountId}:${resourceType}/${resourceId}`;
  logger.debug(`arn ${arnId}`);
  const params = {
    ResourceARNList: [arnId],
    Tags: {
      [KeyName]: name,
      [managedByKey]: managedByValue,
      [stageTagKey]: stage,
    },
  };
  await tagApi.tagResources(params).promise();
};
