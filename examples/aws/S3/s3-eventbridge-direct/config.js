const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudTrail", "CloudWatchEvents", "Lambda", "S3", "SQS"],
});
