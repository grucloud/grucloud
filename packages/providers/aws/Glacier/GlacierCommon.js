const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "addTagsToVault",
  methodUnTagResource: "removeTagsFromVault",
  ResourceArn: "vaultName",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});
