const { ACM } = require("@aws-sdk/client-acm");
const { createEndpoint } = require("../AwsCommon");

exports.createACM = createEndpoint(ACM);
