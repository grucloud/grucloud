const assert = require("assert");
const { map, pipe, tap, get, omit } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { getByNameCore, buildTagsObject } = require("@grucloud/core/Common");
const { findNamespaceInTagsObject } = require("../AwsCommon");
const { AwsClient } = require("../AwsClient");
const {
  createCognitoIdentityProvider,
  tagResource,
  untagResource,
} = require("./CognitoIdentityServiceProviderCommon");

const findId = get("live.Arn");
const findName = get("live.Name");
const pickId = pipe([
  tap(({ Id }) => {
    assert(Id);
  }),
  ({ Id }) => ({ UserPoolId: Id }),
]);

const ignoreErrorCodes = ["ResourceNotFoundException"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html
exports.UserPool = ({ spec, config }) => {
  const cognitoIdentityServiceProvider = createCognitoIdentityProvider(config);
  const client = AwsClient({ spec, config })(cognitoIdentityServiceProvider);

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#describeUserPool-property
  const getById = client.getById({
    pickId,
    method: "describeUserPool",
    getField: "UserPool",
    ignoreErrorCodes,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#listUserPools-property
  const getList = client.getList({
    extraParam: { MaxResults: 10 },
    method: "listUserPools",
    getParam: "UserPools",
    decorate: () => pipe([getById]),
  });

  const getByName = getByNameCore({ getList, findName });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#createUserPool-property
  const create = client.create({
    method: "createUserPool",
    getById,
    pickCreated: () => pipe([get("UserPool")]),
    pickId,
    config,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#updateUserPool-property
  const update = client.update({
    pickId: omit([]),
    filterParams: ({ payload, live }) =>
      pipe([() => payload, defaultsDeep(pickId(live))])(),
    method: "updateUserPool",
    getById,
  });

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#deleteUserPool-property
  const destroy = client.destroy({
    pickId,
    method: "deleteUserPool",
    getById,
    ignoreErrorCodes,
    config,
  });

  const configDefault = ({
    name,
    namespace,
    properties: { Tags, ...otherProps },
    dependencies: {},
  }) =>
    pipe([
      () => otherProps,
      defaultsDeep({
        PoolName: name,
        UserPoolTags: buildTagsObject({
          config,
          namespace,
          name,
          userTags: Tags,
        }),
      }),
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
    tagResource: tagResource({ cognitoIdentityServiceProvider }),
    untagResource: untagResource({ cognitoIdentityServiceProvider }),
  };
};
