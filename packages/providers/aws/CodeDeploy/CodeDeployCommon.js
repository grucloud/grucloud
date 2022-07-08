const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#tagResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(buildArn);
      }),
      (Tags) => ({ ResourceArn: buildArn(live), Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html#untagResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(buildArn);
      }),
      (TagKeys) => ({ ResourceArn: buildArn(live), TagKeys }),
      endpoint().untagResource,
    ]);
