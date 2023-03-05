const assert = require("assert");

const { createTagger } = require("../AwsTagger");
const { pipe, tap, get, assign, tryCatch } = require("rubico");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceARN",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});
