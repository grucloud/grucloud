const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchEvents",
    "CloudWatch",
    "CloudWatchLogs",
    "EventBridge",
    "IAM",
    "Route53",
    "SQS",
  ],
  credentials: { profile: "regionA" },
});
