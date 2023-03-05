const assert = require("assert");
const { pipe, tap, get, pick, eq, omit } = require("rubico");
const { defaultsDeep, isEmpty, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { dependencyIdApi, managedByOther } = require("./ApiGatewayV2Common");

const pickId = pipe([
  tap(({ ApiId, DeploymentId }) => {
    assert(ApiId);
    assert(DeploymentId);
  }),
  pick(["ApiId", "DeploymentId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html
exports.ApiGatewayV2Deployment = ({ compare }) => ({
  type: "Deployment",
  package: "apigatewayv2",
  client: "ApiGatewayV2",
  inferName: ({ dependenciesSpec: { api } }) =>
    pipe([
      tap((params) => {
        assert(api);
      }),
      () => `deployment::${api}`,
    ]),
  findName: () => pipe([({ ApiName }) => `deployment::${ApiName}`]),
  findId: () =>
    pipe([
      get("DeploymentId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  managedByOther,
  cannotBeDeleted: managedByOther,
  propertiesDefault: {},
  ignoreErrorCodes: ["NotFoundException", "BadRequestException"],
  ignoreResource: () =>
    pipe([
      get("dependencies"),
      find(eq(get("type"), "Stage")),
      get("ids"),
      isEmpty,
    ]),
  omitProperties: [
    "StageName",
    "CreatedDate",
    "DeploymentId",
    "DeploymentStatus",
    "DeploymentStatusMessage",
    "ApiName",
  ],
  compare: compare({ filterAll: () => omit(["AutoDeployed"]) }),
  propertiesDefault: { AutoDeployed: false, Description: "" },
  filterLive: () => pick(["Description", "AutoDeployed"]),
  dependencies: {
    api: {
      type: "Api",
      group: "ApiGatewayV2",
      parent: true,
      dependencyId: dependencyIdApi,
    },
    stage: {
      type: "Stage",
      group: "ApiGatewayV2",
      parent: true,
      dependencyId:
        ({ lives, config }) =>
        (live) =>
          pipe([
            lives.getByType({
              providerName: config.providerName,
              type: "Stage",
              group: "ApiGatewayV2",
            }),
            find(eq(get("live.DeploymentId"), live.DeploymentId)),
            get("id"),
          ])(),
    },
    route: {
      type: "Route",
      group: "ApiGatewayV2",
      dependsOnTypeOnly: true,
    },
    integration: {
      type: "Integration",
      group: "ApiGatewayV2",
      dependsOnTypeOnly: true,
    },
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#getDeployment-property
  getById: {
    method: "getDeployment",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#listDeployments-property
  getList: {
    method: "listDeployments",
    getParam: "Deployments",
    decorate: ({ getById }) => pipe([getById]),
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "Api", group: "ApiGatewayV2" },
          pickKey: pipe([pick(["ApiId"])]),
          method: "getDeployments",
          getParam: "Items",
          config,
          decorate: ({ parent: { ApiId, Name: ApiName } }) =>
            pipe([defaultsDeep({ ApiId, ApiName })]),
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#createDeployment-property
  create: {
    method: "createDeployment",
    shouldRetryOnExceptionMessages: [
      "Unable to deploy API because no routes exist in this API",
    ],
    pickCreated: ({ payload }) =>
      pipe([defaultsDeep({ ApiId: payload.ApiId })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#updateDeployment-property
  update: {
    method: "updateDeployment",
    filterParams: ({ payload, diff, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayV2.html#deleteDeployment-property
  destroy: {
    method: "deleteDeployment",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { api, stage },
  }) =>
    pipe([
      tap(() => {
        assert(api, "missing 'api' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        ApiId: getField(api, "ApiId"),
        //TODO is StageName required ?
        StageName: getField(stage, "StageName"),
      }),
    ])(),
});
