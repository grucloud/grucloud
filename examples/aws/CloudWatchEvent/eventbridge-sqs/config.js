const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["APIGateway", "CloudWatchEvents", "IAM", "S3", "SQS"],
});
