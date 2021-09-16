const assert = require("assert");
const { map, pipe, tap, get, eq } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const { shouldRetryOnException } = require("../AwsCommon");

const findId = get("live.id");
const findName = get("live.name");

const pickId = ({ id }) => ({ restApiId: id });

exports.RestApi = ({ spec, config }) => {
  const client = AwsClient({ spec, config });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getRestApi-property
  const getById = client.getById({
    pickId,
    method: "getRestApi",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getRestApis-property
  const getList = client.getList({
    method: "getRestApis",
    getParam: "items",
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createRestApi-property
  const create = client.create({
    pickCreated: (payload) => (result) => pipe([() => result])(),
    method: "createRestApi",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateRestApi-property
  const update = client.update({
    pickId,
    method: "updateRestApi",
    //TODO filterParams
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteRestApi-property
  const destroy = client.destroy({
    pickId,
    method: "deleteRestApi",
    getById,
    ignoreError: eq(get("code"), "NotFoundException"),
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        name,
        tags: buildTagsObject({ config, namespace, name, userTags: tags }),
      }),
    ])();

  return {
    spec,
    findName,
    findId,
    getById,
    create,
    update,
    destroy,
    getByName,
    getList,
    configDefault,
    shouldRetryOnException,
  };
};
