const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { AwsClient } = require("../AwsClient");
const {
  createApiGatewayV2,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./ApiGatewayCommon");

const findId = get("live.ApiId");
const findName = get("live.Name");
const pickId = pick(["ApiId"]);

exports.Api = ({ spec, config }) => {
  const apiGateway = createApiGatewayV2(config);
  const client = AwsClient({ spec, config })(apiGateway);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getApi-property
  const getById = client.getById({
    pickId,
    method: "getApi",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getApis-property
  const getList = client.getList({
    method: "getApis",
    getParam: "Items",
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApi-property
  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Name: name,
        ProtocolType: "HTTP",
        Tags: buildTagsObject({ config, namespace, name, userTags: Tags }),
      }),
    ])();

  const create = client.create({
    method: "createApi",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateApi-property
  const update = client.update({
    pickId,
    method: "updateApi",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteApi-property
  const destroy = client.destroy({
    pickId,
    method: "deleteApi",
    getById,
    ignoreErrorCodes,
  });

  const buildResourceArn = ({ ApiId }) =>
    `arn:aws:apigateway:${config.region}::/apis/${ApiId}`;

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
    tagResource: tagResource({ apiGateway, buildResourceArn }),
    untagResource: untagResource({ apiGateway, buildResourceArn }),
  };
};
