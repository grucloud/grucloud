const assert = require("assert");
const { pipe, tap, get } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { AwsClient } = require("../AwsClient");
const {
  createAPIGateway,
  findDependenciesRestApi,
  ignoreErrorCodes,
} = require("./ApiGatewayCommon");

exports.Model = ({ spec, config }) => {
  const apiGateway = createAPIGateway(config);
  const client = AwsClient({ spec, config })(apiGateway);

  const findId = get("live.id");
  const findName = get("live.name");

  const pickId = ({ restApiId, name }) => ({ restApiId, modelName: name });

  const findDependencies = ({ live, lives }) => [
    findDependenciesRestApi({ live }),
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getModel-property
  const getById = client.getById({
    pickId,
    method: "getModel",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#getModels-property
  //TODO test
  const getList = client.getListWithParent({
    parent: { type: "RestApi", group: "APIGateway" },
    pickKey: pipe([({ id }) => ({ restApiId: id })]),
    method: "getModels",
    getParam: "items",
    config,
    decorate: ({ lives, parent: { id: restApiId, Tags } }) =>
      defaultsDeep({ restApiId, Tags }),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#createModel-property
  const create = client.create({
    method: "createModel",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#updateModel-property
  const update = client.update({
    pickId,
    method: "updateModel",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html#deleteModel-property
  const destroy = client.destroy({
    pickId,
    method: "deleteModel",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { schema, ...otherProps },
    dependencies: { restApi },
  }) =>
    pipe([
      tap(() => {
        assert(restApi, "missing 'restApi' dependency");
      }),
      () => otherProps,
      defaultsDeep({
        name,
        restApiId: getField(restApi, "id"),
        contentType: "application/json",
        schema: JSON.stringify(schema),
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
    findDependencies,
  };
};
