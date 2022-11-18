const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTags",
  methodUnTagResource: "removeTags",
  ResourceArn: "ARN",
  TagsKey: "TagList",
  UnTagsKey: "TagKeys",
});
