const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "ApiGatewayV2",
    "CloudWatchEvents",
    "CloudWatch",
    "CloudWatchLogs",
    "Lambda",
    "SQS",
  ],
  noGlobalEndpoint:true,
  credentials: { profile: "regionB" },
});
