const { pipe, assign, tap, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

exports.assignTags = ({ endpoint, buildArn }) =>
  pipe([
    assign({
      Tags: pipe([
        buildArn,
        (ResourceArn) => ({ ResourceArn }),
        endpoint().listTagsOfResource,
        get("Tags"),
      ]),
    }),
  ]);
