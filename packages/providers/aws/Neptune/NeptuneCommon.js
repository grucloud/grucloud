const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTagsToResource",
  methodUnTagResource: "removeTagsFromResource",
  ResourceArn: "ResourceName",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Neptune.html#addTagsToResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (Tags) => ({ ResourceName: buildArn(live), Tags }),
      endpoint().addTagsToResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Neptune.html#removeTagsFromResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceName: buildArn(live), TagKeys }),
      endpoint().removeTagsFromResource,
    ]);
