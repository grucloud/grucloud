const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#tagResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (tags) => ({ resourceArn: buildArn(live), tags }),
      endpoint().tagResource,
    ]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#untagResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (tagKeys) => ({ resourceArn: buildArn(live), tagKeys }),
      endpoint().untagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Batch.html#listTagsForResource-property
exports.assignTags = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ ARN }) => ({ resourceArn: ARN }),
        endpoint().listTagsForResource,
        get("tags"),
      ]),
    }),
  ]);
