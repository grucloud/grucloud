const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTags",
  methodUnTagResource: "removeTags",
  ResourceArn: "ARN",
  TagsKey: "TagList",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#addTags-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (TagList) => ({ ARN: buildArn(live), TagList }),
      endpoint().addTags,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/OpenSearch.html#removeTags-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ARN: buildArn(live), TagKeys }),
      endpoint().removeTags,
    ]);
