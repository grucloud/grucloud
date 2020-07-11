const { isEmpty } = require("ramda");
const AWS = require("aws-sdk");
const assert = require("assert");
const { KeyName } = require("./AwsCommon");
const { tos } = require("../../tos");
const logger = require("../../logger")({ prefix: "AwsTagResource" });
const { retryCall } = require("../Retry");

exports.tagResource = async ({ config, resourceType, resourceId, name }) => {
  const { managedByKey, managedByValue, region, stageTagKey, stage } = config;
  assert(region);
  assert(stage);

  const { AccountId } = process.env;
  assert(AccountId);

  AWS.config.update({ region });
  const tagApi = new AWS.ResourceGroupsTaggingAPI();

  const arnId = `arn:aws:ec2:${region}:${AccountId}:${resourceType}/${resourceId}`;
  const fqn = `arn:aws:ec2:${region}:${AccountId}:${resourceType}/${name}`;

  logger.debug(`tagResource: arn ${arnId}`);
  const params = {
    ResourceARNList: [arnId],
    Tags: {
      [KeyName]: name,
      [managedByKey]: managedByValue,
      [stageTagKey]: stage,
      id: resourceId,
      arnId,
      fqn,
    },
  };

  await retryCall({
    name: `tag ${arnId}`,
    fn: async () => {
      // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ResourceGroupsTaggingAPI.html#getResources-property
      await tagApi.tagResources(params).promise();
      const getParams = {
        TagFilters: [
          {
            Key: "id",
            Values: [resourceId],
          },
        ],
      };

      const { ResourceTagMappingList } = await tagApi
        .getResources(getParams)
        .promise();

      logger.debug(`getResource for ${arnId}: ${tos(ResourceTagMappingList)}`);
      if (isEmpty(ResourceTagMappingList[0].Tags)) {
        logger.error(`getResource ${arnId} not tagged`);
        throw { code: 422, message: "resource not tagged" };
      }
    },
    shouldRetry: () => true,
    retryCount: 5,
    retryDelay: config.retryDelay,
  });
};
