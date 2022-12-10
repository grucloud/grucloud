const assert = require("assert");
const { pipe, tap, get, assign, reduce } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "TagsToAdd",
  UnTagsKey: "TagsToRemove",
});

exports.assignTags = ({ buildArn, endpoint }) =>
  pipe([
    assign({
      Tags: pipe([
        buildArn,
        (ResourceArn) => ({ ResourceArn }),
        endpoint().getTags,
        get("Tags"),
      ]),
    }),
  ]);
