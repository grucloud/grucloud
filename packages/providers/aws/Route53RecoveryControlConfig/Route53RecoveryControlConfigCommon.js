const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#tagResource-property
exports.tagResource =
  ({ findId }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(findId({ live }));
      }),
      (Tags) => ({ ResourceArn: findId({ live }), Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53RecoveryControlConfig.html#untagResource-property
exports.untagResource =
  ({ findId }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(findId({ live }));
      }),
      (TagKeys) => ({ ResourceArn: findId({ live }), TagKeys }),
      endpoint().untagResource,
    ]);

exports.assignTags = ({ findId, endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        (live) => ({ live }),
        findId,
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);
