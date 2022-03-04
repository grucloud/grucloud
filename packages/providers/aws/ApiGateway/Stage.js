const assert = require("assert");
const { map, pipe, tap, get, pick, omit } = require("rubico");
const { defaultsDeep, values, flatten, when, isEmpty } = require("rubico/x");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { createEndpoint } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createAPIGateway,
  findDependenciesRestApi,
} = require("./ApiGatewayCommon");
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
  const apiGateway = createAPIGateway(config);
  const client = AwsClient({ spec, config })(apiGateway);

  // Find dependencies for APIGateway::Stage
  const findDependencies = ({ live, lives }) => [
    findDependenciesRestApi({ live }),
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getStage-property
  const getById = client.getById({
    pickId,
    method: "getStage",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getStages-property
  const getList = client.getListWithParent({
    parent: { type: "RestApi", group: "APIGateway" },
    pickKey: pipe([({ id }) => ({ restApiId: id })]),
    method: "getStages",
    // All other apis have 'items'
    getParam: "item",
    config,
    decorate: ({ lives, parent: { id: restApiId, Tags } }) =>
      defaultsDeep({ restApiId, Tags }),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createStage-property
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
    ignoreErrorCodes: ["NotFoundException"],
    config,
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
  };
};
