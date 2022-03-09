const { pipe, tap } = require("rubico");
const { RDS } = require("@aws-sdk/client-rds");
const { createEndpoint } = require("../AwsCommon");

exports.createRDS = createEndpoint(RDS);

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
