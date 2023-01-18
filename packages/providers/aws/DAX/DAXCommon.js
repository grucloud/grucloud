const assert = require("assert");
const { pipe, tap, eq, get, tryCatch, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceName",
  TagsKey: "Tags",
  UnTagsKey: "Keys",
});

exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (ResourceName) => ({ ResourceName }),
          endpoint().listTags,
          get("Tags"),
        ]),
        (error) => []
      ),
    }),
  ]);
