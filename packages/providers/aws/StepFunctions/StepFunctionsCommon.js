const assert = require("assert");
const { pipe, tap, get } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html#tagResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([(tags) => ({ resourceArn: id, tags }), endpoint().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/StepFunctions.html#untagResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ id }) =>
    pipe([
      (tagKeys) => ({ resourceArn: id, tagKeys }),
      endpoint().untagResource,
    ]);
