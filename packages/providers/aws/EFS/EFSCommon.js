const assert = require("assert");
const { pipe, tap, get, eq } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html#tagResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([(Tags) => ({ ResourceId: id, Tags }), endpoint().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EFS.html#untagResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (TagKeys) => ({ ResourceId: id, TagKeys }),
      endpoint().untagResource,
    ]);
