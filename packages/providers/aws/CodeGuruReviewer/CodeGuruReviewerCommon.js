const assert = require("assert");
const { pipe, tap, get, assign, tryCatch } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (resourceArn) => ({ resourceArn }),
          endpoint().listTagsForResource,
          get("Tags"),
        ]),
        (error) => []
      ),
    }),
  ]);
