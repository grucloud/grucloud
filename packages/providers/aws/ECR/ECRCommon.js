const { pipe, tap } = require("rubico");

const { createEndpoint } = require("../AwsCommon");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.createECR = createEndpoint("ecr", "ECR");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#tagResource-property
exports.tagResource =
  ({ ecr }) =>
  ({ id }) =>
    pipe([(tags) => ({ resourceArn: id, tags }), ecr().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#untagResource-property
exports.untagResource =
  ({ ecr }) =>
  ({ id }) =>
    pipe([(tagKeys) => ({ resourceArn: id, tagKeys }), ecr().untagResource]);
