const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { createEndpoint } = require("../AwsCommon");

exports.createDynamoDB = createEndpoint(DynamoDB);

exports.ignoreErrorCodes = ["ResourceNotFoundException"];
