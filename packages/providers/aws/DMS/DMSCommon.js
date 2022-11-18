const assert = require("assert");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTagsToResource",
  methodUnTagResource: "untagRremoveTagsFromResourceesource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});
