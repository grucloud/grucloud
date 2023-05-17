const assert = require("assert");
const { pipe, tap, assign, get, tryCatch } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/MemoryDB.html#listTags-property
exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    tap((params) => {
      assert(buildArn);
      assert(endpoint);
    }),
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (ResourceArn) => ({ ResourceArn }),
          endpoint().listTags,
          get("TagList"),
        ]),
        (error) => []
      ),
    }),
  ]);
