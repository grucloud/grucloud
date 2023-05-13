const { pipe, assign, tap, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

exports.assignTags = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      tags: pipe([
        buildArn,
        (resourceArn) => ({ resourceArn }),
        endpoint().listTagsForResource,
        get("tags"),
      ]),
    }),
  ]);
