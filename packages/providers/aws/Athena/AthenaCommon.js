const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");
const { v4: uuidv4 } = require("uuid");

const { createTagger } = require("../AwsTagger");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Athena.html

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "ResourceARN",
  TagsKey: "Tags",
  UnTagsKey: "TagKeys",
});

exports.ignoreErrorCodes = [
  "ResourceNotFoundException",
  "InvalidRequestException",
];
