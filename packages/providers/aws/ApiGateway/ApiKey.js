const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");
const { buildTagsObject } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const {
  createAPIGateway,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./ApiGatewayCommon");

const findName = get("live.name");
const findId = get("live.id");
const pickId = ({ id }) => ({ apiKey: id });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html
exports.ApiKey = ({ spec, config }) => {
  const endpoint = createAPIGateway(config);
  const client = AwsClient({ spec, config })(endpoint);

  const buildResourceArn =
    ({ config }) =>
    ({ id }) =>
      `arn:aws:apigateway:${config.region}::/apikeys/${id}`;

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getApiKey-property
  const getById = client.getById({
    pickId,
    method: "getApiKey",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getApiKeys-property
  const getList = client.getList({
    method: "getApiKeys",
    getParam: "items",
  });

  const getByName = pipe([
    ({ name }) => getList({ params: { nameQuery: name } }),
    first,
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createApiKey-property
  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        name: name,
        enabled: true,
        tags: buildTagsObject({ name, config, namespace, UserTags: Tags }),
      }),
    ])();

  const create = client.create({
    method: "createApiKey",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateApiKey-property
  const update = client.update({
    pickId,
    method: "updateApiKey",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteApiKey-property
  const destroy = client.destroy({
    pickId,
    method: "deleteApiKey",
    getById,
    ignoreErrorCodes,
  });

  return {
    spec,
    findId,
    getByName,
    getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
    tagResource: tagResource({
      buildResourceArn: buildResourceArn({ config }),
    })({ endpoint }),
    untagResource: untagResource({
      buildResourceArn: buildResourceArn({ config }),
    })({ endpoint }),
  };
};
