const assert = require("assert");
const { pipe, tap, get, tryCatch, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      tags: tryCatch(
        pipe([
          buildArn,
          (resourceArn) => ({ resourceArn }),
          endpoint().listTagsForResource,
          get("tags"),
        ]),
        (error) => []
      ),
    }),
  ]);
