const assert = require("assert");
const { pipe, tap, assign, get } = require("rubico");

const { createTagger } = require("../AwsTagger");

exports.Tagger = createTagger({
  methodTagResource: "tagResource",
  methodUnTagResource: "untagResource",
  ResourceArn: "resourceName",
  TagsKey: "tags",
  UnTagsKey: "tagKeys",
});

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#tagResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (tags) => ({ resourceName: buildArn(live), tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Lightsail.html#untagResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (tagKeys) => ({ resourceName: buildArn(live), tagKeys }),
      endpoint().untagResource,
    ]);
