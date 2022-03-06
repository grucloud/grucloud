const { S3 } = require("@aws-sdk/client-s3");
const { createEndpoint } = require("../AwsCommon");

exports.createS3 = createEndpoint(S3);
