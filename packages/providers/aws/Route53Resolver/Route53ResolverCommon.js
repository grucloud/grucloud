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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#tagResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id, live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (Tags) => ({ ResourceArn: id, Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Route53Resolver.html#untagResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ id, live }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: id, TagKeys }),
      endpoint().untagResource,
    ]);

exports.assignTags = ({ endpoint }) =>
  assign({
    Tags: pipe([
      tap(({ Arn }) => {
        assert(Arn);
      }),
      ({ Arn }) => ({ ResourceArn: Arn }),
      endpoint().listTagsForResource,
      get("Tags"),
    ]),
  });
