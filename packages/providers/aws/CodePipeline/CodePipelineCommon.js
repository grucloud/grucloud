const assert = require("assert");
const { pipe, tap, get, assign } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#tagResource-property
exports.tagResource =
  ({ property }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live[property]);
      }),
      (tags) => ({ resourceArn: live[property], tags }),
      endpoint().tagResource,
    ]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodePipeline.html#untagResource-property
exports.untagResource =
  ({ property }) =>
  ({ endpoint }) =>
  ({ live }) =>
    pipe([
      tap((params) => {
        assert(live[property]);
      }),
      (tagKeys) => ({ resourceArn: live[property], tagKeys }),
      endpoint().untagResource,
    ]);
