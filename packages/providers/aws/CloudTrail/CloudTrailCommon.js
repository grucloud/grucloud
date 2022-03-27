const assert = require("assert");
const { pipe, tap, get } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html#addTags-property
exports.tagResource =
  ({ endpoint }) =>
  ({ live, id }) =>
    pipe([(TagsList) => ({ ResourceId: id, TagsList }), endpoint().addTags]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudTrail.html#removeTags-property
exports.untagResource =
  ({ endpoint }) =>
  ({ live, id }) =>
    pipe([(TagsList) => ({ ResourceId: id, TagsList }), endpoint().removeTags]);
