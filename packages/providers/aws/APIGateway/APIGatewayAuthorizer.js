const assert = require("assert");
const { map, pipe, tap, get, eq, assign } = require("rubico");
const { defaultsDeep, when, find } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");
const { ignoreErrorCodes } = require("./APIGatewayCommon");
const { replaceAccountAndRegion } = require("../AwsCommon");

const findId = () =>
  pipe([
    get("id"),
    tap((id) => {
      assert(id);
    }),
  ]);

const findName = () =>
  pipe([
    get("name"),
    tap((name) => {
      assert(name);
    }),
  ]);

const pickId = pipe([
  tap(({ restApiId, id }) => {
    assert(restApiId);
    assert(id);
  }),
  ({ restApiId, id }) => ({ restApiId, authorizerId: id }),
]);

const assignArn = ({ config }) =>
  pipe([
    tap((params) => {
      assert(config);
    }),
    assign({
      arn: pipe([
        tap(({ id, restApiId }) => {
          assert(id);
          assert(restApiId);
        }),
        ({ restApiId, id }) =>
          `arn:${config.partition}:execute-api:${
            config.region
          }:${config.accountId()}:${restApiId}/authorizers/${id}`,
      ]),
    }),
  ]);

const decorate = ({ live, config }) =>
  pipe([
    tap((params) => {
      assert(live.restApiId);
      assert(config);
    }),
    defaultsDeep({ restApiId: live.restApiId }),
    assignArn({ config }),
  ]);

const managedByOther = () => () => true;

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/APIGateway.html
exports.APIGatewayAuthorizer = ({}) => ({
  type: "Authorizer",
  package: "api-gateway",
  client: "APIGateway",
  inferName: findName,
  findName,
  findId,
  managedByOther,
  cannotBeDeleted: managedByOther,
  getByName: getByNameCore,
  ignoreErrorCodes,
  omitProperties: ["id", "arn", "restApiId", "providerARNs"],
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
      dependencyIds: ({ lives, config }) =>
        pipe([
          get("providerARNs"),
          map((Arn) =>
            pipe([
              lives.getByType({
                type: "UserPool",
                group: "CognitoIdentityServiceProvider",
                providerName: config.providerName,
              }),
              find(eq(get("live.Arn"), Arn)),
              get("id"),
            ])()
          ),
        ]),
    },
  },
  filterLive: ({ lives, providerConfig }) =>
    pipe([
      when(
        get("authorizerUri"),
        assign({
          authorizerUri: pipe([
            get("authorizerUri"),
            replaceAccountAndRegion({ lives, providerConfig }),
          ]),
        })
      ),
    ]),
  getById: {
    method: "getAuthorizer",
    pickId,
    decorate,
  },
  create: {
    method: "createAuthorizer",
    pickCreated: ({ payload }) => pipe([defaultsDeep(payload)]),
  },
  update: {
    pickId,
    method: "updateAuthorizer",
  },
  destroy: {
    pickId,
    method: "deleteAuthorizer",
    ignoreErrorMessages: ["not found"],
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
          decorate: ({ config, parent: { id: restApiId } }) =>
            pipe([decorate({ config, live: { restApiId } })]),
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
