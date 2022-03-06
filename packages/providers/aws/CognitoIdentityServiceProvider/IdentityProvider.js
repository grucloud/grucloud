const assert = require("assert");
const { map, pipe, tap, get, pick } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getField } = require("@grucloud/core/ProviderCommon");
const { getByNameCore } = require("@grucloud/core/Common");

const { findNamespaceInTagsObject } = require("../AwsCommon");

const { AwsClient } = require("../AwsClient");
const {
  createCognitoIdentityProvider,
} = require("./CognitoIdentityServiceProviderCommon");
const findId = get("ProviderName");
const findName = get("ProviderName");
const ignoreErrorCodes = ["ResourceNotFoundException"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.IdentityProvider = ({ spec, config }) => {
  const cognitoIdentityServiceProvider = createCognitoIdentityProvider(config);
  const client = AwsClient({ spec, config })(cognitoIdentityServiceProvider);

  const pickId = pick(["ProviderName", "UserPoolId"]);

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
      tap(({ UserPoolId }) => {
        assert(UserPoolId);
      }),
      pick("UserPoolId"),
    ]),
    method: "listIdentityProviders",
    getParam: "Providers",
    config,
    decorate: ({ parent: { UserPoolId, Tags } }) =>
      pipe([
        assign({
          Tags: (live) =>
            pipe([
              tap((params) => {
                assert(live);
              }),
              // () => ({
              //   ResourceArn: live.Arn,
              // }),
              // cognitoIdentityServiceProvider().listTagsForResource,
              // get("Tags"),
            ])(),
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
        UserPoolId: getField(userPool, "UserPoolId"),
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
