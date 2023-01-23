const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep, identity } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./ApiGatewayV2Common");

const buildArn =
  ({ config }) =>
  ({ ApiId }) =>
    `arn:aws:apigateway:${config.region}::/apis/${ApiId}`;

const pickId = pipe([
  tap(({ ApiId }) => {
    assert(ApiId);
  }),
  pick(["ApiId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html
exports.ApiGatewayV2Api = () => ({
  type: "Api",
  package: "apigatewayv2",
  client: "ApiGatewayV2",
  inferName: () => get("Name"),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId:
    ({ config }) =>
    ({ ApiId }) =>
      `arn:aws:execute-api:${config.region}:${config.accountId()}:${ApiId}`,
  ignoreErrorCodes,
  omitProperties: [
    "ApiEndpoint",
    "ApiId",
    "CreatedDate",
    "AccessLogSettings.DestinationArn",
  ],
  propertiesDefault: {
    Version: "1.0",
    ProtocolType: "HTTP",
    ApiKeySelectionExpression: "$request.header.x-api-key",
    RouteSelectionExpression: "$request.method $request.path",
    DisableExecuteApiEndpoint: false,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getApi-property
  getById: {
    method: "getApi",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#listApis-property
  getList: {
    method: "getApis",
    getParam: "Items",
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createApi-property
  create: {
    method: "createApi",
    pickCreated: ({ payload }) => pipe([identity]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateApi-property
  update: {
    method: "updateApi",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteApi-property
  destroy: {
    method: "deleteApi",
    pickId,
  },
  getByName: getByNameCore,
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
    config,
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        Name: name,
        ProtocolType: "HTTP",
        Tags: buildTagsObject({ config, namespace, name, userTags: Tags }),
      }),
    ])(),
});
