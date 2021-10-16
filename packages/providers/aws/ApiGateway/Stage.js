const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  tryCatch,
  pick,
  flatMap,
  omit,
} = require("rubico");
const {
  pluck,
  defaultsDeep,
  values,
  flatten,
  when,
  isEmpty,
} = require("rubico/x");
const logger = require("@grucloud/core/logger")({
  prefix: "Stage",
});

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.stageName");
const findName = get("live.stageName");

const pickId = pick(["restApiId", "stageName"]);

const translatePropertyMap = {
  metricsEnabled: "metrics/enabled",
  dataTraceEnabled: "logging/dataTrace",
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
  const client = AwsClient({ spec, config });
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "RestApi",
      group: "APIGateway",
      ids: [live.restApiId],
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getStage-property
  const getById = client.getById({
    pickId,
    method: "getStage",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getStages-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList stage`);
      }),
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "RestApi",
          group: "APIGateway",
        }),
      pluck("live"),
      flatMap(({ id: restApiId, tags }) =>
        tryCatch(
          pipe([
            tap(() => {
              assert(restApiId);
            }),
            () => ({ restApiId }),
            apiGateway().getStages,
            // All other apis have 'items'
            get("item"),
            map(defaultsDeep({ restApiId, tags })),
          ]),
          (error) =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              () => ({
                error,
              }),
            ])()
        )()
      ),
    ])();

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createStage-property
  const create = client.create({
    method: "createStage",
    filterPayload: omit(["methodSettings"]),
    pickId,
    getById,
    config,
    postCreate:
      ({ payload, name }) =>
      ({ restApiId, stageName }) =>
        pipe([
          () => payload,
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
          (patchOperations) => ({
            restApiId,
            stageName,
            patchOperations,
          }),
          tap((params) => {
            assert(true);
          }),
          apiGateway().updateStage,
        ])(),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateStage-property
  const update = client.update({
    pickId,
    method: "updateStage",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteStage-property
  const destroy = client.destroy({
    pickId,
    method: "deleteStage",
    getById,
    ignoreError: eq(get("code"), "NotFoundException"),
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { restApi },
  }) =>
    pipe([
      tap(() => {
        assert(restApi, "missing 'restApi' dependency");
      }),
      () => properties,
      defaultsDeep({
        stageName: name,
        restApiId: getField(restApi, "id"),
        deploymentId: getField(restApi, "deployments[0].id"),
        tags: buildTagsObject({ config, namespace, name }),
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
    findDependencies,
  };
};
