const assert = require("assert");
const { pipe, tap, get, pick, or, not } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");
const { getByNameCore } = require("@grucloud/core/Common");

const { getField } = require("@grucloud/core/ProviderCommon");

const pickId = pipe([
  tap(({ UserPoolId, ProviderName }) => {
    assert(UserPoolId);
    assert(ProviderName);
  }),
  pick(["ProviderName", "UserPoolId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.CognitoIdentityServiceProviderIdentityProvider = () => ({
  type: "IdentityProvider",
  package: "cognito-identity-provider",
  client: "CognitoIdentityProvider",
  inferName: () => get("ProviderName"),
  dependencies: {
    userPool: {
      type: "UserPool",
      group: "CognitoIdentityServiceProvider",
      parent: true,
      dependencyId: () => get("UserPoolId"),
    },
  },
  findName: () =>
    pipe([
      get("ProviderName"),
      tap((name) => {
        assert(name);
      }),
    ]),
  findId: () =>
    pipe([
      get("ProviderName"),
      tap((id) => {
        assert(id);
      }),
    ]),
  omitProperties: [],
  propertiesDefault: {},
  dependencies: {
    userPool: {
      type: "UserPool",
      group: "CognitoIdentityServiceProvider",
      parent: true,
      dependencyId: () => get("UserPoolId"),
    },
    certificate: {
      type: "Certificate",
      group: "ACM",
      dependencyId: ({ lives, config }) =>
        get("CustomDomainConfig.CertificateArn"),
    },
  },
  ignoreErrorCodes: ["ResourceNotFoundException"],
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#getIdentityProvider-property
  getById: {
    method: "describeIdentityProvider",
    getField: "IdentityProvider",
    pickId,
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listIdentityProviders-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "UserPool", group: "CognitoIdentityServiceProvider" },
          pickKey: pipe([({ Id }) => ({ UserPoolId: Id })]),
          method: "listIdentityProviders",
          getParam: "Providers",
          config,
        }),
    ])(),
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createIdentityProvider-property
  create: {
    method: "createIdentityProvider",
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateIdentityProvider-property
  // update: {
  //   method: "updateIdentityProvider",
  //   filterParams: ({ payload, live }) =>
  //     pipe([() => payload, defaultsDeep(pickId(live))])(),
  // },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteIdentityProvider-property
  destroy: {
    method: "deleteIdentityProvider",
    pickId,
  },
  getByName: getByNameCore,
  configDefault: ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { userPool, certificate },
    config,
  }) =>
    pipe([
      tap(() => {
        assert(userPool);
      }),
      () => otherProps,
      defaultsDeep({
        Domain: name,
        UserPoolId: getField(userPool, "Id"),
      }),
      when(
        () => certificate,
        defaultsDeep({
          CustomDomainConfig: {
            CertificateArn: getField(certificate, "CertificateArn"),
          },
        })
      ),
    ])(),
});
