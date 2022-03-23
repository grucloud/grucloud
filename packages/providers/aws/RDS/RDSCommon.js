const { pipe, tap, assign, omit, get } = require("rubico");
const { createEndpoint } = require("../AwsCommon");

exports.createRDS = createEndpoint("rds", "RDS");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#addTagsToResource-property
exports.tagResource =
  ({ rds }) =>
  ({ id }) =>
    pipe([(Tags) => ({ ResourceName: id, Tags }), rds().addTagsToResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html#removeTagsFromResource-property
exports.untagResource =
  ({ rds }) =>
  ({ id }) =>
    pipe([
      (TagKeys) => ({ ResourceName: id, TagKeys }),
      rds().removeTagsFromResource,
    ]);

exports.renameTagList = pipe([
  assign({ Tags: get("TagList") }),
  omit(["TagList"]),
]);
