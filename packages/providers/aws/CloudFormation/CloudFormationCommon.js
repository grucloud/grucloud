const { pipe, get } = require("rubico");
const { CloudFormation } = require("@aws-sdk/client-cloudformation");
const { createEndpoint } = require("../AwsCommon");

exports.createCloudFormation = createEndpoint(CloudFormation);
