const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceARN",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.assignTags = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      Tags: pipe([
        buildArn,
        (ResourceARN) => ({ ResourceARN }),
        endpoint().listTagsForResource,
        get("Tags"),
      ]),
    }),
  ]);
