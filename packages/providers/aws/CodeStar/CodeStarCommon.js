const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagProject",
  methodUnTagResource: "untagProject",
  ResourceArn: "id",
  TagsKey: "tags",
  UnTagsKey: "tags",
});
