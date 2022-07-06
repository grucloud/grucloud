const assert = require("assert");
const { tap, pipe } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#tagResource-property
exports.tagResource =
  ({ property }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (Tags) => ({ ResourceArn: live[property], Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/NetworkManager.html#untagResource-property
exports.untagResource =
  ({ property }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: live[property], TagKeys }),
      endpoint().untagResource,
    ]);
