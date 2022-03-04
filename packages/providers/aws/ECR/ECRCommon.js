const { ECR } = require("@aws-sdk/client-ecr");
const { createEndpoint } = require("../AwsCommon");

exports.createECR = createEndpoint(ECR);
