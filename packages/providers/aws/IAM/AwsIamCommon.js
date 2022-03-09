const { pipe, get } = require("rubico");
const { IAM } = require("@aws-sdk/client-iam");
const { createEndpoint } = require("../AwsCommon");

exports.createIAM = createEndpoint(IAM);

exports.tagResourceIam =
  ({ field, method }) =>
  ({ iam }) =>
  ({ live }) =>
    pipe([
      (Tags) => ({
        [field]: live[field],
        Tags,
      }),
      iam()[method],
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagUser-property
exports.untagResourceIam =
  ({ field, method }) =>
  ({ iam }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({
        [field]: live[field],
        TagKeys,
      }),
      iam()[method],
    ]);
