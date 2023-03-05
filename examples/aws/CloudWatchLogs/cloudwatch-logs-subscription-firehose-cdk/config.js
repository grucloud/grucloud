const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatchLogs", "Firehose", "IAM", "Lambda", "S3"],
});
