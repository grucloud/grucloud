const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchEvents",
    "CloudWatchLogs",
    "IAM",
    "EC2",
    "Scheduler",
    "SQS",
  ],
});
