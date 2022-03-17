const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep, when, isEmpty } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createAPIGateway,
  findDependenciesRestApi,
  ignoreErrorCodes,
} = require("./ApiGatewayCommon");

const pickId = pipe([
  tap((params) => {
    assert(true);
  }),
  tap(({ restApiId, id }) => {
    assert(restApiId);
    assert(id);
  }),
  ({ restApiId, id }) => ({
    restApiId,
    resourceId: id,
  }),
]);

exports.Resource = ({ spec, config }) => {
  const apiGateway = createAPIGateway(config);
  const client = AwsClient({ spec, config })(apiGateway);

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
        assert(live.path);
      }),
      //TODO
      (restApiName) => `${restApiName}::${live.path}`,
      tap((params) => {
        assert(true);
      }),
    ])();

  const findId = get("live.id");

  const findDependencies = ({ live, lives }) => [
    findDependenciesRestApi({ live }),
    { type: "Resource", group: "APIGateway", ids: [live.parentId] },
  ];
  const managedByOther = pipe([
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
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getResources-property
  const getList = pipe([
    tap((params) => {
      assert(true);
    }),
    client.getListWithParent({
      parent: { type: "RestApi", group: "APIGateway" },
      pickKey: pipe([({ id }) => ({ restApiId: id })]),
      method: "getResources",
      getParam: "items",
      config,
      decorate: ({ lives, parent: { id: restApiId, name } }) =>
        pipe([defaultsDeep({ restApiName: name, restApiId })]),
    }),
  ]);

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createResource-property
  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { restApi, parent },
  }) =>
    pipe([
      tap(() => {
        assert(restApi, "missing 'restApi' dependency");
        assert(properties.pathPart, "missing 'pathPart'");
      }),
      () => properties,
      defaultsDeep({
        restApiId: getField(restApi, "id"),
      }),
      when(() => parent, defaultsDeep({ parentId: getField(parent, "id") })),
    ])();

  const create = client.create({
    method: "createResource",
    pickCreated:
      ({ payload }) =>
      ({ id }) =>
        pipe([() => payload, defaultsDeep({ id })])(),
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateResource-property
  const update = client.update({
    pickId,
    method: "updateResource",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteResource-property
  const destroy = client.destroy({
    pickId,
    method: "deleteResource",
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
    managedByOther,
    cannotBeDeleted: () => true,
  };
};
