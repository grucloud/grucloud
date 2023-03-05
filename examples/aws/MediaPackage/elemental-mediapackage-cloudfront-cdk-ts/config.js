const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchLogs",
    "CloudWatchEvents",
    "CloudFront",
    "IAM",
    "KMS",
    "Lambda",
    "MediaPackage",
    "S3",
    "SecretsManager",
    "SNS",
    "SQS",
  ],
});
