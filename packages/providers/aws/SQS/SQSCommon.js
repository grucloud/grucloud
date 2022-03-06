const { SQS } = require("@aws-sdk/client-sqs");
const { createEndpoint } = require("../AwsCommon");

exports.createSQS = createEndpoint(SQS);
