const assert = require("assert");
const { map, pipe, tap, get } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { createAwsResource } = require("../AwsClient");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes, Tagger } = require("./ApiGatewayCommon");

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

const model = ({ config }) => ({
  package: "api-gateway",
  client: "APIGateway",
  ignoreErrorCodes,
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
});

exports.Authorizer = ({ spec, config }) =>
  createAwsResource({
    model: model({ config }),
    spec,
    config,
    findName,
    findId,
    getByName: getByNameCore,
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
    //...Tagger({ buildArn: buildArn({ config }) }),
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
