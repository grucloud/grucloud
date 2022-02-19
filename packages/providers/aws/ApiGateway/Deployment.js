const assert = require("assert");
const {
  map,
  pipe,
  tap,
  get,
  eq,
  filter,
  tryCatch,
  flatMap,
} = require("rubico");
const { pluck, defaultsDeep } = require("rubico/x");

const logger = require("@grucloud/core/logger")({
  prefix: "Deployment",
});

const { getByNameCore } = require("@grucloud/core/Common");
const {
  createEndpoint,
  shouldRetryOnException,
  findNameInTagsOrId,
} = require("../AwsCommon");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");

const findId = get("live.id");
const findName = findNameInTagsOrId({ findId });
const pickId = pipe([
  tap(({ restApiId, id }) => {
    assert(restApiId);
    assert(id);
  }),
  ({ restApiId, id }) => ({ restApiId, deploymentId: id }),
]);

exports.Deployment = ({ spec, config }) => {
  const client = AwsClient({ spec, config });
  const apiGateway = () =>
    createEndpoint({ endpointName: "APIGateway" })(config);

  const findDependencies = ({ live, lives }) => [
    {
      type: "RestApi",
      group: "APIGateway",
      ids: [live.ApiId],
    },
    {
      type: "Stage",
      group: "APIGateway",
      ids: pipe([
        () =>
          lives.getByType({
            providerName: config.providerName,
            type: "Stage",
            group: "APIGateway",
          }),
        filter(eq(get("live.id"), live.deploymentId)),
        pluck("id"),
      ])(),
    },
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getDeployment-property
  const getById = client.getById({
    pickId,
    method: "getDeployment",
    ignoreErrorCodes: ["NotFoundException"],
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getDeployments-property
  const getList = ({ lives }) =>
    pipe([
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
            () => apiGateway().getDeployments({ restApiId }),
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

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createDeployment-property
  const create = client.create({
    pickCreated:
      ({ resolvedDependencies }) =>
      (result) =>
        pipe([
          tap(() => {
            assert(resolvedDependencies.restApi);
          }),
          () => ({
            id: result.id,
            restApiId: resolvedDependencies.restApi.live.id,
          }),
          tap((params) => {
            assert(true);
          }),
        ])(),
    method: "createDeployment",
    getById,
    pickId,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateDeployment-property
  const update = client.update({
    pickId,
    method: "updateDeployment",
    getById,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteDeployment-property
  const destroy = client.destroy({
    pickId,
    method: "deleteDeployment",
    getById,
    ignoreErrorCodes: ["NotFoundException"],
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
        restApiId: getField(restApi, "id"),
        //stageName: getField(stage, "name"),
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
