const { pipe, tap } = require("rubico");

const { ECR } = require("@aws-sdk/client-ecr");
const { createEndpoint } = require("../AwsCommon");

exports.createECR = createEndpoint(ECR);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#tagResource-property
exports.tagResource =
  ({ ecr }) =>
  ({ id }) =>
    pipe([(tags) => ({ resourceArn: id, tags }), ecr().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ECR.html#untagResource-property
exports.untagResource =
  ({ ecr }) =>
  ({ id }) =>
    pipe([(tagKeys) => ({ resourceArn: id, tagKeys }), ecr().untagResource]);
