const assert = require("assert");
const { pipe, tap, get, assign, reduce } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "TagsToAdd",
  UnTagsKey: "TagsToRemove",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#tagResource-property
exports.tagResource =
  ({ findId }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(findId(live));
      }),
      (TagsToAdd) => ({ ResourceArn: findId(live), TagsToAdd }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#untagResource-property
exports.untagResource =
  ({ findId }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(findId(live));
      }),
      (TagsToRemove) => ({ ResourceArn: findId(live), TagsToRemove }),
      endpoint().untagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Glue.html#getTags-property
exports.assignTags = ({ endpoint, findId }) =>
  pipe([
    assign({
      Tags: pipe([
        findId,
        (ResourceArn) => ({ ResourceArn }),
        endpoint().getTags,
        get("Tags"),
      ]),
    }),
  ]);
