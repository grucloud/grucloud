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

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/AppConfig.html#listTagsForResource-property
exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (ResourceArn) => ({ ResourceArn }),
          endpoint().listTagsForResource,
          get("Tags"),
        ]),
        (error) => []
      ),
    }),
  ]);
