const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatchLogs", "CloudFront", "IAM", "Lambda", "S3"],
});
