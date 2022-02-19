const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const { shouldRetryOnException } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const { buildTagsObject } = require("@grucloud/core/Common");

const findName = get("live.name");
const findId = get("live.id");
const pickId = ({ id }) => ({ apiKey: id });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html
exports.ApiKey = ({ spec, config }) => {
  const client = AwsClient({ spec, config });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getApiKey-property
  const getById = client.getById({
    pickId,
    method: "getApiKey",
    ignoreErrorCodes: ["NotFoundException"],
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
  const create = client.create({
    method: "createApiKey",
    pickCreated: () => (result) => pipe([() => result])(),
    pickId,
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateApiKey-property
  const update = client.update({
    pickId,
    filterParams: pipe([
      tap((params) => {
        assert(true);
      }),
    ]),
    method: "updateApiKey",
    config,
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteApiKey-property
  //TODO ignoreErrorCodes instead
  const destroy = client.destroy({
    pickId,
    method: "deleteApiKey",
    getById,
    ignoreErrorCodes: ["NotFoundException"],
    config,
  });

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
    shouldRetryOnException,
  };
};
