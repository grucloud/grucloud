const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  regionSource: "us-west-2",
  includeGroups: [
    "ApiGatewayV2",
    "CloudWatchEvents",
    "CloudWatch",
    "CloudWatchLogs",
    "EventBridge",
    "IAM",
    "Lambda",
    "Route53",
    "SQS",
  ],
  credentials: { profile: "regionA" },
});
