const assert = require("assert");
const { tap, pipe, eq, get, omit } = require("rubico");
const { when } = require("rubico/x");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewall.html#tagResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      tap((params) => {
        assert(true);
      }),
      (Tags) => ({ ResourceArn: id, Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkFirewall.html#untagResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: id, TagKeys }),
      endpoint().untagResource,
    ]);

// put it in decorate
exports.omitEncryptionConfiguration = when(
  eq(get("EncryptionConfiguration.Type"), "AWS_OWNED_KMS_KEY"),
  omit(["EncryptionConfiguration"])
);
