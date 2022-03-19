const assert = require("assert");
const { pipe, tap, get, eq, filter } = require("rubico");
const { pluck, defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const { findNameInTagsOrId } = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");
const { createAPIGateway, ignoreErrorCodes } = require("./ApiGatewayCommon");

const findId = get("live.id");

const findName = pipe([
  get("live"),
  tap((params) => {
    assert(true);
  }),
  tap(({ restApiName }) => {
    assert(restApiName);
  }),
  ({ restApiName }) => `deployment::${restApiName}`,
  tap((params) => {
    assert(true);
  }),
]);

const pickId = pipe([
  tap(({ restApiId, id }) => {
    assert(restApiId);
    assert(id);
  }),
  ({ restApiId, id }) => ({ restApiId, deploymentId: id }),
]);

exports.Deployment = ({ spec, config }) => {
  const apiGateway = createAPIGateway(config);
  const client = AwsClient({ spec, config })(apiGateway);

  const findDependencies = ({ live, lives }) => [
    {
      type: "RestApi",
      group: "APIGateway",
      ids: [live.restApiId],
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
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getDeployments-property
  const getList = client.getListWithParent({
    parent: { type: "RestApi", group: "APIGateway" },
    pickKey: pipe([
      tap(({ id }) => {
        assert(id);
      }),
      ({ id }) => ({ restApiId: id }),
    ]),
    method: "getDeployments",
    getParam: "items",
    config,
    decorate: ({ lives, parent: { id: restApiId, name: restApiName } }) =>
      pipe([
        tap((params) => {
          assert(restApiId);
          assert(restApiName);
        }),
        defaultsDeep({ restApiId, restApiName }),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createDeployment-property
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
        ])(),
    method: "createDeployment",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateDeployment-property
  const update = client.update({
    pickId,
    method: "updateDeployment",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteDeployment-property
  const destroy = client.destroy({
    pickId,
    method: "deleteDeployment",
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
  };
};
