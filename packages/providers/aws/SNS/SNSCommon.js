const assert = require("assert");
const { pipe, tap, get } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#tagResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ live, id }) =>
    pipe([(Tags) => ({ ResourceArn: id, Tags }), endpoint().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SNS.html#untagResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ live, id }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: id, TagKeys }),
      endpoint().untagResource,
    ]);
