const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatchLogs", "Firehose", "Lambda", "S3"],
});
