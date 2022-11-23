const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const { buildTagsObject } = require("@grucloud/core/Common");
const { createAwsResource } = require("../AwsClient");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes, Tagger } = require("./ApiGatewayCommon");

const findName = () => get("name");
const findId = () => get("id");
const pickId = ({ id }) => ({ apiKey: id });

const buildArn =
  ({ config }) =>
  ({ id }) =>
    `arn:aws:apigateway:${config.region}::/apikeys/${id}`;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html

const model = ({ config }) => ({
  package: "api-gateway",
  client: "APIGateway",
  ignoreErrorCodes,
  getById: {
    method: "getApiKey",
    pickId,
  },
  getList: {
    method: "getApiKeys",
    getParam: "items",
  },
  create: {
    method: "createApiKey",
  },
  update: {
    pickId,
    method: "updateApiKey",
    //filterParams: ({ payload, live, diff }) => pipe([() => payload])(),
  },
  destroy: {
    pickId,
    method: "deleteApiKey",
  },
});

exports.ApiKey = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName,
    findId,
    getByName: ({ getList }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
        ({ name }) => ({ params: { nameQuery: name } }),
        getList,
        first,
      ]),
    ...Tagger({ buildArn: buildArn({ config }) }),
    configDefault: ({
      name,
      namespace,
      properties: { tags, ...otherProps },
      dependencies: {},
    }) =>
      pipe([
        () => otherProps,
        defaultsDeep({
          name: name,
          enabled: true,
          tags: buildTagsObject({ name, config, namespace, userTags: tags }),
        }),
      ])(),
  });
