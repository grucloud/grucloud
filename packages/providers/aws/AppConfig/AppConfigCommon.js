const assert = require("assert");
const { pipe, tap, assign, get, tryCatch } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeyList",
});
// TODO remove
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#tagResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (Tags) => ({ ResourceArn: buildArn(live), Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#untagResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeyList) => ({ ResourceArn: buildArn(live), TagKeyList }),
      endpoint().untagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listTagsForResource-property
exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      tags: tryCatch(
        pipe([
          buildArn,
          (ResourceArn) => ({ ResourceArn }),
          endpoint().listTagsForResource,
          get("tags"),
        ]),
        (error) => []
      ),
    }),
  ]);
