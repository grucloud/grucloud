const assert = require("assert");
const { map, pipe, tap, get, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore } = require("@grucloud/core/Common");
const { findNamespaceInTagsObject } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createCognitoIdentityProvider,
  findDependenciesUserPool,
  ignoreErrorCodes,
} = require("./CognitoIdentityServiceProviderCommon");
const { getField } = require("@grucloud/core/ProviderCommon");

const findId = get("live.ClientId");
const findName = get("live.ClientName");
const pickId = pipe([
  tap(({ UserPoolId, ClientId }) => {
    assert(UserPoolId);
    assert(ClientId);
  }),
  ({ ClientId, UserPoolId }) => ({ ClientId, UserPoolId }),
]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.UserPoolClient = ({ spec, config }) => {
  const cognitoIdentityServiceProvider = createCognitoIdentityProvider(config);
  const client = AwsClient({ spec, config })(cognitoIdentityServiceProvider);

  const findDependencies = ({ live, lives }) => [
    findDependenciesUserPool({ live, lives, config }),
  ];
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#describeUserPoolClient-property
  const getById = client.getById({
    pickId,
    method: "describeUserPoolClient",
    getField: "UserPoolClient",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listUserPoolClients-property
  const getList = client.getListWithParent({
    parent: { type: "UserPool", group: "CognitoIdentityServiceProvider" },
    pickKey: pipe([({ Id }) => ({ UserPoolId: Id })]),
    method: "listUserPoolClients",
    getParam: "UserPoolClients",
    config,
    decorate: ({ lives, parent }) => pipe([getById]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPoolClient-property
  const create = client.create({
    method: "createUserPoolClient",
    getById,
    pickCreated: () => pipe([get("UserPoolClient")]),
    pickId,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateUserPoolClient-property
  const update = client.update({
    pickId: omit([]),
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
    method: "updateUserPoolClient",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteUserPoolClient-property
  const destroy = client.destroy({
    pickId,
    method: "deleteUserPoolClient",
    getById,
    ignoreErrorCodes,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: { userPool },
  }) =>
    pipe([
      tap((params) => {
        assert(userPool);
      }),
      () => otherProps,
      defaultsDeep({
        ClientName: name,
        UserPoolId: getField(userPool, "Id"),
      }),
    ])();

  return {
    spec,
    findId,
    findDependencies,
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
