const { pipe, tap, eq, get } = require("rubico");
const { find } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");

exports.createCognitoIdentityProvider = createEndpoint(
  "cognito-identity-provider",
  "CognitoIdentityProvider"
);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#tagResource-property
exports.tagResource =
  ({ cognitoIdentityServiceProvider }) =>
  ({ live, id }) =>
    pipe([
      (Tags) => ({ ResourceArn: id, Tags }),
      cognitoIdentityServiceProvider().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#untagResource-property
exports.untagResource =
  ({ cognitoIdentityServiceProvider }) =>
  ({ live, id }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: id, TagKeys }),
      cognitoIdentityServiceProvider().untagResource,
    ]);

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

exports.findDependenciesUserPool = ({ live, lives, config }) => ({
  type: "UserPool",
  group: "CognitoIdentityServiceProvider",
  ids: [
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "UserPool",
          group: "CognitoIdentityServiceProvider",
        }),
      find(eq(get("live.Id"), live.UserPoolId)),
      get("id"),
    ])(),
  ],
});
