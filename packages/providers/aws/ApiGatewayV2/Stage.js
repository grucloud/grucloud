const assert = require("assert");
const { pipe, tap, get, pick, eq } = require("rubico");
const { defaultsDeep, when, find, append } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { omitIfEmpty } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { buildTagsObject } = require("@grucloud/core/Common");

const {
  Tagger,
  ignoreErrorCodes,
  dependencyIdApi,
  managedByOther,
} = require("./ApiGatewayV2Common");

const buildArn = ({ config }) =>
  pipe([
    tap(({ ApiId, StageName }) => {
      assert(ApiId);
      assert(StageName);
    }),
    ({ ApiId, StageName }) =>
      `arn:aws:apigateway:${config.region}::/apis/${ApiId}/stages/${StageName}`,
  ]);

const findName =
  ({ lives, config }) =>
  (live) =>
    pipe([
      tap(() => {
        assert(live.ApiId);
        assert(live.StageName);
      }),
      lives.getByType({
        type: "Api",
        group: "ApiGatewayV2",
        providerName: config.providerName,
      }),
      find(eq(get("live.ApiId"), live.ApiId)),
      get("name"),
      tap((name) => {
        assert(name);
      }),
      append(`::${live.StageName}`),
    ])();

const pickId = pipe([
  tap(({ ApiId, StageName }) => {
    assert(ApiId);
    assert(StageName);
  }),
  pick(["ApiId", "StageName"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html
exports.ApiGatewayV2Stage = () => ({
  type: "Stage",
  package: "apigatewayv2",
  client: "ApiGatewayV2",
  inferName:
    ({ dependenciesSpec: { api } }) =>
    ({ StageName }) =>
      pipe([
        tap(() => {
          assert(StageName);
          assert(api);
        }),
        () => `${api}::${StageName}`,
      ])(),
  findName,
  findId: buildArn,
  ignoreErrorCodes,
  managedByOther,
  cannotBeDeleted: managedByOther,
  propertiesDefault: {
    RouteSettings: {},
    DefaultRouteSettings: {
      DetailedMetricsEnabled: false,
    },
    StageVariables: {},
  },
  omitProperties: [
    "CreatedDate",
    "DeploymentId",
    "LastUpdatedDate",
    "AccessLogSettings.DestinationArn",
    "LastDeploymentStatusMessage",
    "ApiId",
    "ApiGatewayManaged",
  ],
  filterLive: () => pipe([omitIfEmpty(["StageVariables"])]),
  dependencies: {
    api: {
      type: "Api",
      group: "ApiGatewayV2",
      parent: true,
      dependencyId: dependencyIdApi,
    },
    logGroup: {
      type: "LogGroup",
      group: "CloudWatchLogs",
      dependencyId: ({ lives, config }) =>
        get("AccessLogSettings.DestinationArn"),
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getStage-property
  getById: {
    method: "getStage",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#listStages-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Api", group: "ApiGatewayV2" },
          pickKey: pipe([pick(["ApiId"])]),
          method: "getStages",
          getParam: "Items",
          config,
          decorate: ({ parent: { ApiId } }) => pipe([defaultsDeep({ ApiId })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createStage-property
  create: {
    method: "createStage",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateStage-property
  update: {
    method: "updateStage",
    filterParams: ({ payload, diff, live }) => pipe([() => payload])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteStage-property
  destroy: {
    method: "deleteStage",
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
    dependencies: { api, logGroup },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        StageName: name,
        ApiId: getField(api, "ApiId"),
        Tags: buildTagsObject({ config, namespace, userTags: Tags }),
      }),
      when(
        () => logGroup,
        defaultsDeep({
          AccessLogSettings: {
            DestinationArn: getField(logGroup, "arn"),
            Format:
              '$context.identity.sourceIp - - [$context.requestTime] "$context.httpMethod $context.routeKey $context.protocol" $context.status $context.responseLength $context.requestId',
          },
        })
      ),
    ])(),
});
