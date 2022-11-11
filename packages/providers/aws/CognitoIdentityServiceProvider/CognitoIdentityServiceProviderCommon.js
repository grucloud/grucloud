const { pipe, tap, eq, get } = require("rubico");

const { createEndpoint } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

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
