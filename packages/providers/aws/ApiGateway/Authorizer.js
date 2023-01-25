const assert = require("assert");
const { map, pipe, tap, get } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes } = require("./ApiGatewayCommon");

const findId = () => get("id");
const findName = () => get("name");

const pickId = pipe([
  tap(({ restApiId, id }) => {
    assert(restApiId);
    assert(id);
  }),
  ({ restApiId, id }) => ({ restApiId, authorizerId: id }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html

exports.Authorizer = ({}) => ({
  type: "Authorizer",
  package: "api-gateway",
  client: "APIGateway",
  findName,
  findId,
  getByName: getByNameCore,
  ignoreErrorCodes,
  omitProperties: ["id", "restApiId", "providerARNs"],
  dependencies: {
    restApi: {
      type: "RestApi",
      group: "APIGateway",
      parent: true,
      dependencyId: ({ lives, config }) => get("restApiId"),
    },
    lambdaFunction: {
      type: "Function",
      group: "Lambda",
      dependencyId: ({ lives, config }) => get("authorizerUri"),
    },
    userPools: {
      type: "UserPool",
      group: "CognitoIdentityServiceProvider",
      list: true,
      dependencyId: ({ lives, config }) => get("providerARNs"),
    },
  },
  getById: {
    method: "getAuthorizer",
    pickId,
  },
  create: {
    method: "createAuthorizer",
  },
  update: {
    pickId,
    method: "updateAuthorizer",
  },
  destroy: {
    pickId,
    method: "deleteAuthorizer",
  },
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "RestApi", group: "APIGateway" },
          pickKey: pipe([
            tap(({ id }) => {
              assert(id);
            }),
            ({ id }) => ({ restApiId: id }),
          ]),
          method: "getAuthorizers",
          getParam: "items",
          config,
          decorate: ({ lives, parent: { id: restApiId } }) =>
            defaultsDeep({ restApiId }),
        }),
    ])(),
  configDefault: ({
    name,
    namespace,
    properties,
    dependencies: { restApi, userPools },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(restApi, "missing 'restApi' dependency");
      }),
      () => properties,
      defaultsDeep({
        name,
        restApiId: getField(restApi, "id"),
      }),
      when(
        () => userPools,
        defaultsDeep({
          providerARNs: pipe([
            () => userPools,
            map((userPool) => getField(userPool, "Arn")),
          ])(),
        })
      ),
    ])(),
});
