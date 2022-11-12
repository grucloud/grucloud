const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { v4: uuidv4 } = require("uuid");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceArn",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.assignClientToken = assign({
  ClientToken: uuidv4,
});
