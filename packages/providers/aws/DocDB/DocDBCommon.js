const { pipe, assign, tap, get, tryCatch } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTagsToResource",
  methodUnTagResource: "removeTagsFromResource",
  ResourceArn: "ResourceName",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: tryCatch(
        pipe([
          buildArn,
          (ResourceName) => ({ ResourceName }),
          endpoint().listTagsForResource,
          get("TagList"),
        ]),
        (error) => []
      ),
    }),
  ]);
