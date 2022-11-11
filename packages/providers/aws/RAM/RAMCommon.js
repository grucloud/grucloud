const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceShareArn",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#tagResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id, live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (tags) => ({ resourceShareArn: id, tags }),
      endpoint().tagResource,
    ]);
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RAM.html#untagResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ id, live }) =>
    pipe([
      (tagKeys) => ({ resourceShareArn: id, tagKeys }),
      endpoint().untagResource,
    ]);
