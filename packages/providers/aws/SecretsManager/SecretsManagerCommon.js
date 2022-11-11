const assert = require("assert");
const { pipe, tap, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "SecretId",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#tagResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ live, id }) =>
    pipe([(Tags) => ({ SecretId: id, Tags }), endpoint().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#untagResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ live, id }) =>
    pipe([(TagKeys) => ({ SecretId: id, TagKeys }), endpoint().untagResource]);
