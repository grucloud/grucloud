const { pipe, get } = require("rubico");
const { AppSync } = require("@aws-sdk/client-appsync");
const { createEndpoint } = require("../AwsCommon");

exports.createAppSync = createEndpoint(AppSync);

exports.ignoreErrorCodes = ["NotFoundException"];

exports.findDependenciesGraphqlApi = ({ live, lives }) => ({
  type: "GraphqlApi",
  group: "AppSync",
  ids: [live.apiId],
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#tagResource-property
exports.tagResource =
  ({ appSync }) =>
  ({ live, id }) =>
    pipe([(tags) => ({ resourceArn: id, tags }), appSync().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppSync.html#untagResource-property
exports.untagResource =
  ({ appSync }) =>
  ({ live, id }) =>
    pipe([
      (tagKeys) => ({ resourceArn: id, tagKeys }),
      appSync().untagResource,
    ]);
