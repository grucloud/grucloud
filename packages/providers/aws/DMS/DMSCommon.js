const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTagsToResource",
  methodUnTagResource: "removeTagsFromResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.listTagsForResource = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      Tags: pipe([
        buildArn,
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTagsForResource,
        get("TagList"),
      ]),
    }),
  ]);
