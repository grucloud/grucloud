const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ Identifier, UserPoolId }) => {
    assert(Identifier);
    assert(UserPoolId);
  }),
  pick(["Identifier", "UserPoolId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.CognitoIdentityServiceProviderResourceServer = () => ({
  type: "ResourceServer",
  package: "cognito-identity-provider",
  client: "CognitoIdentityProvider",
  inferName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findName: () =>
    pipe([
      get("Name"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("Identifier"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: ["UserPoolId"],
  propertiesDefault: {},
  dependencies: {
    userPool: {
      type: "UserPool",
      group: "CognitoIdentityServiceProvider",
      parent: true,
      dependencyId: () =>
        pipe([
          get("UserPoolId"),
          tap((UserPoolId) => {
            assert(UserPoolId);
          }),
        ]),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#getResourceServer-property
  getById: {
    method: "describeResourceServer",
    getField: "ResourceServer",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listResourceServers-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "UserPool", group: "CognitoIdentityServiceProvider" },
          pickKey: pipe([
            tap(({ Id }) => {
              assert(Id);
            }),
            ({ Id }) => ({ UserPoolId: Id, MaxResults: 10 }),
          ]),
          method: "listResourceServers",
          getParam: "ResourceServers",
          config,
          decorate: () =>
            pipe([
              tap((params) => {
                assert(true);
              }),
              getById({}),
            ]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createResourceServer-property
  create: {
    method: "createResourceServer",
    pickCreated: ({ payload }) => pipe([get("ResourceServer")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateResourceServer-property
  update: {
    method: "updateResourceServer",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteResourceServer-property
  destroy: {
    method: "deleteResourceServer",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { userPool },
    config,
  }) =>
    pipe([
      tap((params) => {
        assert(userPool);
      }),
      () => otherProps,
      defaultsDeep({
        UserPoolId: getField(userPool, "Id"),
      }),
    ])(),
});
