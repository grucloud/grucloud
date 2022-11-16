const assert = require("assert");
const { pipe, tap, get, pick, or, not } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");

const ignoreCodeMessages = ["No such domain or user pool exists."];

const pickId = pipe([
  tap(({ UserPoolId, Domain }) => {
    assert(UserPoolId);
    assert(Domain);
  }),
  pick(["Domain", "UserPoolId"]),
]);

const decorate = ({ endpoint }) =>
  pipe([
    tap((params) => {
      assert(endpoint);
    }),
  ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.CognitoIdentityServiceProviderUserPoolDomain = () => ({
  type: "UserPoolDomain",
  package: "cognito-identity-provider",
  client: "CognitoIdentityProvider",
  inferName: get("properties.Domain"),
  findName: pipe([
    get("live"),
    get("Domain"),
    tap((name) => {
      assert(name);
    }),
  ]),
  findId: pipe([
    get("live"),
    get("Domain"),
    tap((id) => {
      assert(id);
    }),
  ]),
  omitProperties: [
    "AWSAccountId",
    "CloudFrontDistribution",
    "S3Bucket",
    "Status",
    "UserPoolId",
    "Version",
    "CustomDomainConfig",
  ],
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
  ignoreCodeMessages,
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#getUserPoolDomain-property
  getById: {
    method: "describeUserPoolDomain",
    getField: "DomainDescription",
    pickId: pipe([pick(["Domain"])]),
    decorate,
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listUserPoolDomains-property
  getList: ({ client, endpoint, getById, config }) =>
    pipe([
      () =>
        client.getListWithParent({
          parent: { type: "UserPool", group: "CognitoIdentityServiceProvider" },
          pickKey: pipe([
            ({ Domain, CustomDomain }) => ({ Domain: CustomDomain || Domain }),
          ]),
          filterParent: or([get("live.Domain"), get("live.CustomDomain")]),
          method: "describeUserPoolDomain",
          getParam: "DomainDescription",
          config,
          decorate: () => pipe([getById({})]),
        }),
    ])(),

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPoolDomain-property
  create: {
    method: "createUserPoolDomain",
    shouldRetryOnExceptionMessages: [
      "Custom domain is not a valid subdomain: Was not able to resolve the root domain, please ensure an A record exists for the root domain",
      "One or more of the CNAMEs you provided are already associated with a different resource",
    ],
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    postCreate: ({ dependencies, lives }) =>
      pipe([() => dependencies().userPool.getLive({ lives })]),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateUserPoolDomain-property
  update: {
    method: "updateUserPoolDomain",
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
  },
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteUserPoolDomain-property
  destroy: {
    method: "deleteUserPoolDomain",
    pickId,
    isInstanceDown: not(get("Status")),
  },
  getByName: ({ getById }) =>
    pipe([({ name }) => ({ Domain: name }), getById({})]),
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
