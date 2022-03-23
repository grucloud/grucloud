const { pipe, get } = require("rubico");
const { createEndpoint } = require("../AwsCommon");

exports.createCloudFormation = createEndpoint(
  "cloudformation",
  "CloudFormation"
);
