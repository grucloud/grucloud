const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudTrail", "CloudWatchEvents", "S3", "SQS"],
});
