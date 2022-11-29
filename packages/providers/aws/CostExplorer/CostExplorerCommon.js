const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");
const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "ResourceTags",
  UnTagsKey: "ResourceTagKeys",
});

exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        buildArn(),
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTagsForResource,
        get("ResourceTags"),
      ]),
    }),
  ]);
