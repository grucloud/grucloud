const assert = require("assert");
const { pipe, tap, assign, get, tryCatch } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.ignoreErrorCodes = [
  "ResourceNotFoundException",
  "AccessDeniedException",
];

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "TagList",
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
          get("TagList"),
        ]),
        (error) => []
      ),
    }),
  ]);
