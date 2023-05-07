const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatch", "CloudWatchLogs", "EC2", "IAM", "SNS"],
});
