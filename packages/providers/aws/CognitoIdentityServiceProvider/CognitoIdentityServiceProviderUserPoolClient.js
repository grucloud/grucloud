const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ ClientId, UserPoolId }) => {
    assert(ClientId);
    assert(UserPoolId);
  }),
  pick(["ClientId", "UserPoolId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.CognitoIdentityServiceProviderUserPoolClient = () => ({
  type: "UserPoolClient",
  package: "cognito-identity-provider",
  client: "CognitoIdentityProvider",
  inferName: get("properties.ClientName"),
  findName: () =>
    pipe([
      get("ClientName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ClientId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: [
    "ClientId",
    "UserPoolId",
    "CreationDate",
    "LastModifiedDate",
  ],
  propertiesDefault: {
    AccessTokenValidity: 60,
    AllowedOAuthFlowsUserPoolClient: false,
    EnableTokenRevocation: true,
    IdTokenValidity: 60,
    PreventUserExistenceErrors: "ENABLED",
    RefreshTokenValidity: 30,
    TokenValidityUnits: {
      AccessToken: "minutes",
      IdToken: "minutes",
      RefreshToken: "days",
    },
    EnablePropagateAdditionalUserContextData: false,
    AuthSessionValidity: 3,
  },
  dependencies: {
    userPool: {
      type: "UserPool",
      group: "CognitoIdentityServiceProvider",
      parent: true,
      dependencyId: () => get("UserPoolId"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#getUserPoolClient-property
  getById: {
    method: "describeUserPoolClient",
    getField: "UserPoolClient",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listUserPoolClients-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "UserPool", group: "CognitoIdentityServiceProvider" },
          pickKey: pipe([({ Id }) => ({ UserPoolId: Id })]),
          method: "listUserPoolClients",
          getParam: "UserPoolClients",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPoolClient-property
  create: {
    method: "createUserPoolClient",
    pickCreated: ({ payload }) => pipe([get("UserPoolClient")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateUserPoolClient-property
  update: {
    method: "updateUserPoolClient",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteUserPoolClient-property
  destroy: {
    method: "deleteUserPoolClient",
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
