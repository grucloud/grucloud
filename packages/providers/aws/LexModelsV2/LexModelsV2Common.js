const assert = require("assert");
const { pipe, tap, assign, get, tryCatch } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceARN",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      tags: tryCatch(
        pipe([
          buildArn,
          (resourceARN) => ({ resourceARN }),
          endpoint().listTagsForResource,
          get("tags"),
        ]),
        (error) => []
      ),
    }),
  ]);
