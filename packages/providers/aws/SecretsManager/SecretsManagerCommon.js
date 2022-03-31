const assert = require("assert");
const { pipe, tap, get } = require("rubico");

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#tagResource-property
exports.tagResource =
  ({ endpoint }) =>
  ({ live, id }) =>
    pipe([(Tags) => ({ SecretId: id, Tags }), endpoint().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#untagResource-property
exports.untagResource =
  ({ endpoint }) =>
  ({ live, id }) =>
    pipe([(Tags) => ({ SecretId: id, Tags }), endpoint().untagResource]);
