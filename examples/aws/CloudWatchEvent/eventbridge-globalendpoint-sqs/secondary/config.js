const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchEvents",
    "CloudWatch",
    "CloudWatchLogs",
    "SQS",
  ],
  noGlobalEndpoint:true,
  credentials: { profile: "regionB" },
});
