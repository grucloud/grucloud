const assert = require("assert");
const { assign, pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const { findNamespaceInTagsObject } = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");
const {
  createCognitoIdentityProvider,
  findDependenciesUserPool,
  ignoreErrorCodes,
} = require("./CognitoIdentityServiceProviderCommon");
const findId = get("ProviderName");
const pickId = pick(["ProviderName", "UserPoolId"]);
const findName = get("ProviderName");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.IdentityProvider = ({ spec, config }) => {
  const cognitoIdentityServiceProvider = createCognitoIdentityProvider(config);
  const client = AwsClient({ spec, config })(cognitoIdentityServiceProvider);

  const findDependencies = ({ live, lives }) => [
    findDependenciesUserPool({ live, lives, config }),
  ];

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#describeIdentityProvider-property
  const getById = client.getById({
    pickId,
    method: "describeIdentityProvider",
    getField: "IdentityProvider",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listIdentityProviders-property
  const getList = client.getListWithParent({
    parent: { type: "UserPool", group: "CognitoIdentityServiceProvider" },
    pickKey: pipe([
      tap(({ Id }) => {
        assert(Id);
      }),
      ({ Id }) => ({ UserPoolId: Id }),
    ]),
    method: "listIdentityProviders",
    getParam: "Providers",
    config,
    decorate: ({ parent }) =>
      pipe([
        tap((params) => {
          assert(true);
        }),
      ]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createIdentityProvider-property
  const configDefault = ({
    name,
    namespace,
    properties,
    dependencies: { userPool },
  }) =>
    pipe([
      tap(() => {
        assert(userPool, "missing 'userPool' dependency");
      }),
      () => properties,
      defaultsDeep({
        ProviderName: name,
        UserPoolId: getField(userPool, "Id"),
      }),
    ])();

  const create = client.create({
    method: "createIdentityProvider",
    getById,
    pickId,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateIdentityProvider-property
  // const update = client.update({
  //   pickId,
  //   method: "updateIdentityProvider",
  //   config,
  //   getById,
  // });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateIdentityProvider-property
  const destroy = client.destroy({
    pickId,
    method: "deleteIdentityProvider",
    getById,
    ignoreErrorCodes,
    config,
  });

  return {
    spec,
    findId,
    findDependencies,
    findNamespace: findNamespaceInTagsObject(config),
    getById,
    getById,
    getByName,
    findName,
    create,
    destroy,
    getList,
    configDefault,
  };
};
