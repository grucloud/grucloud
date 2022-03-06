const { CloudWatchLogs } = require("@aws-sdk/client-cloudwatch-logs");
const { createEndpoint } = require("../AwsCommon");

exports.createCloudWatchLogs = createEndpoint(CloudWatchLogs);
