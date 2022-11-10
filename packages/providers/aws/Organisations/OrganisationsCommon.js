const assert = require("assert");
const { pipe, tap } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceId",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#tagResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (Tags) => ({ ResourceId: buildArn(live), Tags }),
      tap((params) => {
        assert(true);
      }),
      endpoint().tagResource,
      tap((params) => {
        assert(true);
      }),
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Organizations.html#untagResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceId: buildArn(live), TagKeys }),
      endpoint().untagResource,
    ]);
