const assert = require("assert");
const { pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");

const pickId = pipe([
  tap(({ UserPoolId }) => {
    assert(UserPoolId);
  }),
  pick(["UserPoolId"]),
]);

const decorate = ({ endpoint, config }) =>
  pipe([
    tap((params) => {
      assert(true);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.CognitoIdentityServiceProviderRiskConfiguration = () => ({
  type: "RiskConfiguration",
  package: "cognito-identity-provider",
  client: "CognitoIdentityProvider",
  inferName: ({ dependenciesSpec: { userPool } }) =>
    pipe([
      tap(() => {
        assert(userPool);
      }),
      () => userPool,
    ]),
  findName:
    ({ lives, config }) =>
    ({ UserPoolId }) =>
      pipe([
        tap((params) => {
          assert(UserPoolId);
        }),
        () => UserPoolId,
        lives.getById({
          type: "UserPool",
          group: "CognitoIdentityServiceProvider",
          providerName: config.providerName,
        }),
        get("name"),
        tap((name) => {
          assert(name);
        }),
      ])(),
  findId: () =>
    pipe([
      get("UserPoolId"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: ["UserPoolId"],
  propertiesDefault: {},
  ignoreErrorCodes: ["ResourceNotFoundException"],
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
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#describeRiskConfiguration-property
  getById: {
    method: "describeRiskConfiguration",
    getField: "RiskConfiguration",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listRiskConfigurations-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "UserPool", group: "CognitoIdentityServiceProvider" },
          pickKey: pipe([
            ({ Id }) => ({ UserPoolId: Id }),
            tap(({ UserPoolId }) => {
              assert(UserPoolId);
            }),
          ]),
          method: "describeRiskConfiguration",
          getParam: "RiskConfiguration",
          config,
          decorate,
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createRiskConfiguration-property
  create: {
    method: "setRiskConfiguration",
    pickCreated: ({ payload }) => pipe([get("RiskConfiguration")]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateRiskConfiguration-property
  update: {
    method: "setRiskConfiguration",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteRiskConfiguration-property
  destroy: {
    method: "setRiskConfiguration",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { ...otherProps },
    dependencies: {},
    config,
  }) => pipe([() => otherProps, defaultsDeep({})])(),
});
