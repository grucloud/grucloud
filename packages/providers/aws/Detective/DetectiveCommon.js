const assert = require("assert");
const { pipe, tap, eq, get, tryCatch, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

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
