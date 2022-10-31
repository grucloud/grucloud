const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#tagResource-property
exports.tagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live);
      }),
      (Tags) => ({ ResourceARN: buildArn(live), Tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#untagResource-property
exports.untagResource =
  ({ buildArn }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      (TagKeys) => ({ ResourceARN: buildArn(live), TagKeys }),
      endpoint().untagResource,
    ]);
