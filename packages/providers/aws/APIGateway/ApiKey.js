const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, first } = require("rubico/x");

const { buildTagsObject } = require("@grucloud/core/Common");
const { ignoreErrorCodes, Tagger } = require("./APIGatewayCommon");

const findName = () => get("name");
const findId = () => get("id");
const pickId = pipe([
  tap(({ id }) => {
    assert(id);
  }),
  ({ id }) => ({ apiKey: id }),
]);

const buildArn =
  ({ config }) =>
  ({ id }) =>
    `arn:${config.partition}:apigateway:${config.region}::/apikeys/${id}`;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html

exports.ApiKey = ({}) => ({
  type: "ApiKey",
  package: "api-gateway",
  client: "APIGateway",
  inferName: () => get("name"),
  findName,
  findId,
  ignoreErrorCodes,
  omitProperties: ["id", "createdDate", "lastUpdatedDate", "stageKeys"],
  propertiesDefault: { enabled: true },
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
  getByName: ({ getList }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      ({ name }) => ({ params: { nameQuery: name } }),
      getList,
      first,
    ]),
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: {},
    config,
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
