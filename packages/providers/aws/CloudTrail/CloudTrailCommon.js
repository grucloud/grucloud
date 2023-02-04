const assert = require("assert");
const { pipe, tap, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTags",
  methodUnTagResource: "removeTags",
  ResourceArn: "ResourceId",
  TagsKey: "TagsList",
  UnTagsKey: "TagsList",
});
