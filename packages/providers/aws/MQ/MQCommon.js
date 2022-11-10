const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "createTags",
  methodUnTagResource: "deleteTags",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#createTags-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (Tags) => ({ ResourceArn: buildArn(live), Tags }),
      endpoint().createTags,
    ]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#deleteTags-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: buildArn(live), TagKeys }),
      endpoint().deleteTags,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MQ.html#listTags-property
exports.assignTags = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ ARN }) => ({ ResourceArn: ARN }),
        endpoint().listTags,
        get("Tags"),
      ]),
    }),
  ]);
