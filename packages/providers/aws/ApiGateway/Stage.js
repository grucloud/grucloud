const assert = require("assert");
const { map, pipe, tap, get, pick, omit, assign } = require("rubico");
const {
  defaultsDeep,
  values,
  flatten,
  when,
  isEmpty,
  append,
} = require("rubico/x");

const { omitIfEmpty } = require("@grucloud/core/Common");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes, Tagger } = require("./ApiGatewayCommon");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html

const translatePropertyMap = {
  metricsEnabled: "metrics/enabled",
  dataTraceEnabled: "logging/dataTrace",
  loggingLevel: "logging/loglevel",
  throttlingBurstLimit: "throttling/burstLimit",
  throttlingRateLimit: "throttling/rateLimit",
  cachingEnabled: "caching/enabled",
  cacheTtlInSeconds: "caching/ttlInSeconds",
  cacheDataEncrypted: "caching/dataEncrypted",
  requireAuthorizationForCacheControl:
    "caching/requireAuthorizationForCacheControl",
  unauthorizedCacheControlHeaderStrategy:
    "caching/unauthorizedCacheControlHeaderStrategy",
};

const translateProperty = (property) =>
  pipe([() => translatePropertyMap[property], when(isEmpty, () => property)])();

const pickId = pick(["restApiId", "stageName"]);

const buildArn =
  ({ config }) =>
  ({ restApiId, stageName }) =>
    `arn:aws:apigateway:${config.region}::/restapis/${restApiId}/stages/${stageName}`;

const createPatchOperations = pipe([
  get("methodSettings", {}),
  map.entries(([path, settings]) => [
    path,
    pipe([
      () => settings,
      map.entries(([key, value]) => [
        key,
        pipe([
          () => ({
            op: "replace",
            path: `/${path}/${translateProperty(key)}`,
            value: value.toString(),
          }),
        ])(),
      ]),
      values,
    ])(),
  ]),
  values,
  flatten,
]);

exports.Stage = ({ compare }) => ({
  type: "Stage",
  package: "api-gateway",
  client: "APIGateway",
  inferName:
    ({ dependenciesSpec: { restApi } }) =>
    ({ stageName }) =>
      pipe([
        tap(() => {
          assert(stageName);
          assert(restApi);
        }),
        () => `${restApi}::${stageName}`,
      ])(),
  findName:
    ({ lives, config }) =>
    (live) =>
      pipe([
        tap(() => {
          assert(live.restApiId);
          assert(live.stageName);
        }),
        () => live,
        get("restApiId"),
        lives.getById({
          type: "RestApi",
          group: "APIGateway",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
        append(`::${live.stageName}`),
      ])(),
  findId: ({ config }) => pipe([buildArn({ config })]),
  omitProperties: [
    "deploymentId",
    "clientCertificateId",
    "createdDate",
    "lastUpdatedDate",
    "cacheClusterStatus",
    "webAclArn",
    "accessLogSettings",
    "restApiId",
    "restApiName",
  ],
  propertiesDefault: { cacheClusterEnabled: false, tracingEnabled: false },
  compare: compare({
    filterLive: () => pipe([omitIfEmpty(["methodSettings"])]),
  }),
  filterLive: () =>
    pipe([
      pick([
        "stageName",
        "description",
        "StageVariables",
        "methodSettings",
        "accessLogSettings",
        "cacheClusterEnabled",
        "cacheClusterSize",
        "tracingEnabled",
      ]),
      omitIfEmpty(["methodSettings"]),
      omit(["accessLogSettings.destinationArn"]),
    ]),
  dependencies: {
    restApi: {
      type: "RestApi",
      group: "APIGateway",
      parent: true,
      dependencyId: ({ lives, config }) => get("restApiId"),
    },
    // deployment: {
    //   type: "Deployment",
    //   group: "APIGateway",
    //   dependencyId: ({ lives, config }) => get(""),
    // },
    account: {
      type: "Account",
      group: "APIGateway",
      excludeDefaultDependencies: true,
      dependencyId:
        ({ lives, config }) =>
        () =>
          "default",
    },
  },

  getByName: getByNameCore,
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "RestApi", group: "APIGateway" },
          pickKey: pipe([({ id }) => ({ restApiId: id })]),
          method: "getStages",
          // All other apis have 'items'
          getParam: "item",
          config,
          decorate: ({ lives, parent: { id: restApiId, name: restApiName } }) =>
            defaultsDeep({ restApiId, restApiName }),
        }),
    ])(),
  ignoreErrorCodes,
  getById: {
    method: "getStage",
    pickId,
  },
  create: {
    method: "createStage",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    filterPayload: omit(["methodSettings", "accessLogSettings"]),
    postCreate:
      ({ endpoint, payload, name }) =>
      ({ restApiId, stageName }) =>
        pipe([
          () => payload,
          createPatchOperations,
          (patchOperations) => ({
            restApiId,
            stageName,
            patchOperations,
          }),
          endpoint().updateStage,
        ])(),
  },
  update: {
    pickId,
    method: "updateStage",
    filterParams: ({ payload, live, diff }) =>
      pipe([
        () => live,
        pick(["restApiId", "stageName"]),
        assign({
          patchOperations: pipe([() => payload, createPatchOperations]),
        }),
      ])(),
  },
  destroy: {
    pickId,
    method: "deleteStage",
  },
  tagger: ({ config }) =>
    Tagger({
      buildArn: buildArn({ config }),
    }),
  configDefault: ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { restApi },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(restApi, "missing 'restApi' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        restApiId: getField(restApi, "id"),
        deploymentId: getField(restApi, "deployments[0].id"),
        tags: buildTagsObject({ config, namespace, userTags: tags }),
      }),
    ])(),
});
