const { pipe, tap } = require("rubico");

const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { createEndpoint } = require("../AwsCommon");

exports.createDynamoDB = createEndpoint(DynamoDB);

exports.ignoreErrorCodes = ["ResourceNotFoundException"];

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#tagResource-property
exports.tagResource =
  ({ dynamoDB }) =>
  ({ id }) =>
    pipe([(Tags) => ({ ResourceArn: id, Tags }), dynamoDB().tagResource]);

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#untagResource-property
exports.untagResource =
  ({ dynamoDB }) =>
  ({ id }) =>
    pipe([
      (TagKeys) => ({ ResourceArn: id, TagKeys }),
      dynamoDB().untagResource,
    ]);
