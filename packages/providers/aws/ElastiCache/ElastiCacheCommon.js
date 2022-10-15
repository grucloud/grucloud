const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#addTagsToResource-property
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
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#untagResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceName: buildArn(live), TagKeys }),
      endpoint().untagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ElastiCache.html#listTagsForResource-property
exports.assignTags = ({ endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        ({ ARN }) => ({ ResourceName: ARN }),
        endpoint().listTagsForResource,
        get("TagList"),
      ]),
    }),
  ]);
