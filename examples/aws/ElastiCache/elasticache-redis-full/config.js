const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchLogs",
    "EC2",
    "ElastiCache",
    "Firehose",
    "S3",
    "SNS",
  ],
});
