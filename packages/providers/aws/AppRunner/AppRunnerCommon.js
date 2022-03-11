const { pipe, get } = require("rubico");

const { AppRunner } = require("@aws-sdk/client-apprunner");
const { createEndpoint } = require("../AwsCommon");

exports.createAppRunner = createEndpoint(AppRunner);

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#tagResource-property
exports.tagResource =
  ({ appRunner }) =>
  ({ live, id }) =>
    pipe([(Tags) => ({ ResourceArn: id, Tags }), appRunner().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppRunner.html#untagResource-property
exports.untagResource =
  ({ appRunner }) =>
  ({ live, id }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: id, TagKeys }),
      appRunner().untagResource,
    ]);
