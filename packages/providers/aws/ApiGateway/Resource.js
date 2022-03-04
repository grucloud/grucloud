const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createAPIGateway,
  findDependenciesRestApi,
} = require("./ApiGatewayCommon");

const pickId = ({ restApiId, id }) => ({
  restApiId,
  resourceId: id,
});

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
      }),
      (restApiName) => `${restApiName}_${live.path}`,
      tap((params) => {
        assert(true);
      }),
    ])();

  const findId = get("live.id");

  const findDependencies = ({ live, lives }) => [
    findDependenciesRestApi({ live }),
  ];
  // const cannotBeDeleted = pipe([
  //   tap((params) => {
  //     assert(true);
  //   }),
  //   get("live.parentId"),
  //   isEmpty,
  // ]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getResource-property
  const getById = client.getById({
    pickId,
    method: "getResource",
    ignoreErrorCodes: ["NotFoundException"],
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
      decorate: ({ lives, parent: { id: restApiId, name, Tags } }) =>
        pipe([defaultsDeep({ restApiName: name, restApiId, Tags })]),
    }),
  ]);

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createResource-property
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
    cannotBeDeleted: () => true,
  };
};
