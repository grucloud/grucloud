const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTagsToResource",
  methodUnTagResource: "removeTagsFromResource",
  ResourceArn: "ResourceId",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.assignTags = ({ endpoint, ResourceType }) =>
  assign({
    Tags: pipe([
      ({ Name }) => ({
        ResourceId: Name,
        ResourceType,
      }),
      endpoint().listTagsForResource,
      get("TagList"),
    ]),
  });
