const assert = require("assert");
const { map, pipe, tap, get, eq, tryCatch, flatMap } = require("rubico");
const { pluck, defaultsDeep, size, isEmpty } = require("rubico/x");
const logger = require("@grucloud/core/logger")({
  prefix: "Resource",
});

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { createEndpoint, shouldRetryOnException } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");

const pickId = ({ restApiId, id }) => ({
  restApiId,
  resourceId: id,
});

exports.Resource = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const findName = ({ live, lives }) =>
    pipe([
      tap(() => {
        assert(true);
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
      (restApiName) => `${restApiName}_${live.path}`,
      tap((params) => {
        assert(true);
      }),
    ])();

  const findId = get("live.id");

  const findDependencies = ({ live, lives }) => [
    {
      type: "RestApi",
      group: "APIGateway",
      ids: [live.restApiId],
    },
  ];
  const cannotBeDeleted = pipe([
    tap((params) => {
      assert(true);
    }),
    get("live.parentId"),
    isEmpty,
  ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getResource-property
  const getById = client.getById({
    pickId,
    method: "getResource",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getResources-property
  const getList = ({ lives }) =>
    pipe([
      tap(() => {
        assert(lives);
        logger.info(`getList resource`);
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
            () => apiGateway().getResources({ restApiId }),
            get("items"),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createResource-property
  const create = client.create({
    method: "createResource",
    getById,
    pickId,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateResource-property
  const update = client.update({
    pickId,
    method: "updateResource",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteResource-property
  const destroy = client.destroy({
    pickId,
    method: "deleteResource",
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
        pathPart: name,
        restApiId: getField(restApi, "id"),
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
    cannotBeDeleted,
  };
};
