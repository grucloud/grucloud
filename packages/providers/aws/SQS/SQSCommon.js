const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagQueue",
  methodUnTagResource: "untagQueue",
  ResourceArn: "QueueUrl",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});
