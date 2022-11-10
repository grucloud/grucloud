const { pipe, tap } = require("rubico");

const { createEndpoint } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.createDynamoDB = createEndpoint("dynamodb", "DynamoDB");

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#tagResource-property
exports.tagResource =
  ({ dynamoDB }) =>
  ({ id }) =>
    pipe([(Tags) => ({ ResourceArn: id, Tags }), dynamoDB().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#untagResource-property
exports.untagResource =
  ({ dynamoDB }) =>
  ({ id }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: id, TagKeys }),
      dynamoDB().untagResource,
    ]);
