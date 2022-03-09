const { pipe, get } = require("rubico");
const { unless, isEmpty } = require("rubico/x");
const { IAM } = require("@aws-sdk/client-iam");
const { createEndpoint } = require("../AwsCommon");

exports.createIAM = createEndpoint(IAM);

exports.tagResourceIam =
  ({ field, method }) =>
  ({ iam }) =>
  ({ diff }) =>
    pipe([
      () => diff,
      get("tags.targetTags"),
      (Tags) => ({
        [field]: diff.liveIn[field],
        Tags,
      }),
      iam()[method],
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#untagUser-property
exports.untagResourceIam =
  ({ field, method }) =>
  ({ iam }) =>
  ({ diff }) =>
    pipe([
      () => diff,
      get("tags.removedKeys"),
      unless(
        isEmpty,
        pipe([
          (TagKeys) => ({
            [field]: diff.liveIn[field],
            TagKeys,
          }),
          iam()[method],
        ])
      ),
    ]);
