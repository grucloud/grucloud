const { RDS } = require("@aws-sdk/client-rds");
const { createEndpoint } = require("../AwsCommon");

exports.createRDS = createEndpoint(RDS);
