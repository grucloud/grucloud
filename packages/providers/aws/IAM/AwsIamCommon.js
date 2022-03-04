const { IAM } = require("@aws-sdk/client-iam");
const { createEndpoint } = require("../AwsCommon");

exports.createIAM = createEndpoint(IAM);
