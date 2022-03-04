const { SSM } = require("@aws-sdk/client-ssm");
const { createEndpoint } = require("../AwsCommon");

exports.createSSM = createEndpoint(SSM);
