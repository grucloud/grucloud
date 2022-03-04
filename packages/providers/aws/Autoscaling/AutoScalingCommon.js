const { AutoScaling } = require("@aws-sdk/client-auto-scaling");
const { createEndpoint } = require("../AwsCommon");

exports.createAutoScaling = createEndpoint(AutoScaling);
