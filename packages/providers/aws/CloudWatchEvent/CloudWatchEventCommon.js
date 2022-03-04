const { CloudWatchEvents } = require("@aws-sdk/client-cloudwatch-events");
const { createEndpoint } = require("../AwsCommon");

exports.createCloudWatchEvents = createEndpoint(CloudWatchEvents);
