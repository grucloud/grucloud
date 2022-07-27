const assert = require("assert");
const { map, pipe, tap, get, pick, not, or } = require("rubico");
const { defaultsDeep, when } = require("rubico/x");

const { findNamespaceInTagsObject } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createCognitoIdentityProvider,
  ignoreErrorCodes,
} = require("./CognitoIdentityServiceProviderCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const ignoreCodeMessages = ["No such domain or user pool exists."];

const findId = get("live.Domain");
const findName = get("live.Domain");
const pickId = pipe([
  tap(({ UserPoolId, Domain }) => {
    assert(UserPoolId);
    assert(Domain);
  }),
  pick(["Domain", "UserPoolId"]),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.UserPoolDomain = ({ spec, config }) => {
  const cognitoIdentityServiceProvider = createCognitoIdentityProvider(config);
  const client = AwsClient({ spec, config })(cognitoIdentityServiceProvider);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#describeUserPoolDomain-property
  const getById = client.getById({
    pickId: pipe([pick(["Domain"])]),
    method: "describeUserPoolDomain",
    getField: "DomainDescription",
    ignoreErrorCodes,
    ignoreCodeMessages,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listUserPoolDomain-property
  const getList = client.getListWithParent({
    parent: { type: "UserPool", group: "CognitoIdentityServiceProvider" },
    pickKey: pipe([
      ({ Domain, CustomDomain }) => ({ Domain: CustomDomain || Domain }),
    ]),
    filterParent: or([get("live.Domain"), get("live.CustomDomain")]),
    method: "describeUserPoolDomain",
    getParam: "DomainDescription",
    config,
  });

  const getByName = pipe([({ name }) => ({ Domain: name }), getById]);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPoolDomain-property
  const create = client.create({
    method: "createUserPoolDomain",
    shouldRetryOnExceptionMessages: [
      "Custom domain is not a valid subdomain: Was not able to resolve the root domain, please ensure an A record exists for the root domain",
    ],
    getById,
    pickCreated:
      ({ payload }) =>
      () =>
        payload,
    postCreate: ({ dependencies, lives }) =>
      pipe([() => dependencies().userPool.getLive({ lives })]),
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateUserPoolDomain-property
  const update = client.update({
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
    method: "updateUserPoolDomain",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteUserPoolDomain-property
  const destroy = client.destroy({
    pickId,
    method: "deleteUserPoolDomain",
    getById,
    isInstanceDown: not(get("Status")),
    ignoreErrorCodes,
    ignoreCodeMessages,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { userPool, certificate },
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
    ])();

  return {
    spec,
    findId,
    findNamespace: findNamespaceInTagsObject(config),
    getByName,
    getById,
    findName,
    create,
    update,
    destroy,
    getList,
    configDefault,
  };
};
