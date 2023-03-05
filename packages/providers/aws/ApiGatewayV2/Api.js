const assert = require("assert");
const { pipe, tap, get, pick, assign, switchCase } = require("rubico");
const { defaultsDeep, identity, first, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { buildTagsObject } = require("@grucloud/core/Common");

const { Tagger, ignoreErrorCodes } = require("./ApiGatewayV2Common");
const { replaceAccountAndRegion } = require("../AwsCommon");

const buildArn = () =>
  pipe([
    get("Arn"),
    tap((arn) => {
      assert(arn);
    }),
  ]);

const assignArn = ({ config }) =>
  pipe([
    assign({
      Arn: pipe([
        tap(({ ApiId }) => {
          assert(ApiId);
        }),
        ({ ApiId }) => `arn:aws:apigateway:${config.region}::/apis/${ApiId}`,
      ]),
    }),
  ]);

const assignArnV2 = ({ config }) =>
  pipe([
    assign({
      ArnV2: pipe([
        tap(({ ApiId }) => {
          assert(ApiId);
        }),
        ({ ApiId }) =>
          `arn:aws:execute-api:${config.region}:${config.accountId()}:${ApiId}`,
      ]),
    }),
  ]);

const assignEndpoint = ({ config }) =>
  pipe([
    assign({
      Endpoint: pipe([
        tap(({ ApiId }) => {
          assert(ApiId);
        }),
        ({ ApiId }) => `${ApiId}.execute-api.${config.region}.amazonaws.com`,
      ]),
    }),
  ]);

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
    assignArn({ config }),
    assignArnV2({ config }),
    assignEndpoint({ config }),
    (live) =>
      pipe([
        () => live,
        pickId,
        endpoint().getIntegrations,
        get("Items"),
        first,
        switchCase([
          get("ApiGatewayManaged"),
          pipe([
            get("IntegrationUri"),
            tap((IntegrationUri) => {
              assert(IntegrationUri);
            }),
            (Target) => ({ ...live, Target }),
          ]),
          () => live,
        ]),
      ])(),
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
  findId: ({ config }) =>
    pipe([
      get("ApiId"),
      tap((ApiId) => {
        assert(ApiId);
      }),
    ]),
  ignoreErrorCodes,
  omitProperties: [
    "Arn",
    "ArnV2",
    "Endpoint",
    "ApiEndpoint",
    "ApiId",
    "CreatedDate",
    "AccessLogSettings.DestinationArn",
    "Version",
  ],
  propertiesDefault: {
    Version: "1.0",
    ProtocolType: "HTTP",
    ApiKeySelectionExpression: "$request.header.x-api-key",
    RouteSelectionExpression: "$request.method $request.path",
    DisableExecuteApiEndpoint: false,
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("Target"),
        assign({
          Target: pipe([
            get("Target"),
            replaceAccountAndRegion({ lives, providerConfig }),
          ]),
        })
      ),
    ]),
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
        ProtocolType: "HTTP",
        Tags: buildTagsObject({ config, namespace, name, userTags: Tags }),
      }),
    ])(),
});
