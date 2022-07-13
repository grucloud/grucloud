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

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createAPIGateway,
  findDependenciesRestApi,
  ignoreErrorCodes,
  tagResource,
  untagResource,
} = require("./ApiGatewayCommon");

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

exports.Stage = ({ spec, config }) => {
  const endpoint = createAPIGateway(config);
  const client = AwsClient({ spec, config })(endpoint);

  const buildResourceArn =
    ({ config }) =>
    ({ restApiId, stageName }) =>
      `arn:aws:apigateway:${config.region}::/restapis/${restApiId}/stages/${stageName}`;

  const findId = pipe([get("live"), buildResourceArn({ config })]);

  const findName = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(live.restApiId);
        assert(live.stageName);
      }),
      () =>
        lives.getById({
          id: live.restApiId,
          type: "RestApi",
          group: "APIGateway",
          providerName: config.providerName,
        }),
      get("name"),
      tap((name) => {
        assert(name);
      }),
      append(`::${live.stageName}`),
    ])();

  const pickId = pick(["restApiId", "stageName"]);

  // Find dependencies for APIGateway::Stage
  const findDependencies = ({ live, lives }) => [
    findDependenciesRestApi({ live }),
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getStage-property
  const getById = client.getById({
    pickId,
    method: "getStage",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getStages-property
  const getList = client.getListWithParent({
    parent: { type: "RestApi", group: "APIGateway" },
    pickKey: pipe([({ id }) => ({ restApiId: id })]),
    method: "getStages",
    // All other apis have 'items'
    getParam: "item",
    config,
    decorate: ({ lives, parent: { id: restApiId, name: restApiName, Tags } }) =>
      defaultsDeep({ restApiId, restApiName, Tags }),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createStage-property
  const configDefault = ({
    name,
    namespace,
    properties: { tags, ...otherProps },
    dependencies: { restApi },
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
    ])();

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

  const create = client.create({
    method: "createStage",
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    filterPayload: omit(["methodSettings", "accessLogSettings"]),
    getById,
    postCreate:
      ({ payload, name }) =>
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
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateStage-property
  const update = client.update({
    pickId,
    method: "updateStage",
    getById,
    filterParams: ({ payload, live, diff }) =>
      pipe([
        () => live,
        pick(["restApiId", "stageName"]),
        assign({
          patchOperations: pipe([() => payload, createPatchOperations]),
        }),
      ])(),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteStage-property
  const destroy = client.destroy({
    pickId,
    method: "deleteStage",
    getById,
    ignoreErrorCodes,
  });

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
    findDependencies,
    tagResource: tagResource({
      buildResourceArn: buildResourceArn({ config }),
    })({ endpoint }),
    untagResource: untagResource({
      buildResourceArn: buildResourceArn({ config }),
    })({ endpoint }),
  };
};
