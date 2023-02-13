const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchLogs",
    "CloudWatchEvents",
    "IAM",
    "KMS",
    "MediaLive",
    "MediaPackage",
    "S3",
    "SecretsManager",
  ],
});
