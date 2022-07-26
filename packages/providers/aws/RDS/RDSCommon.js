const assert = require("assert");
const { pipe, tap, assign, omit, get, eq } = require("rubico");
const { find } = require("rubico/x");

const { createEndpoint } = require("../AwsCommon");

exports.createRDS = createEndpoint("rds", "RDS");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#addTagsToResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (Tags) => ({ ResourceName: id, Tags }),
      endpoint().addTagsToResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#removeTagsFromResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (TagKeys) => ({ ResourceName: id, TagKeys }),
      endpoint().removeTagsFromResource,
    ]);

exports.renameTagList = pipe([
  assign({ Tags: get("TagList") }),
  omit(["TagList"]),
]);

exports.findDependenciesSecret =
  ({ secretField, rdsUsernameField }) =>
  ({ lives, config }) =>
  (live) =>
    pipe([
      () =>
        lives.getByType({
          type: "Secret",
          group: "SecretsManager",
          providerName: config.providerName,
        }),
      find(eq(get(`live.SecretString.${secretField}`), live[rdsUsernameField])),
    ])();
