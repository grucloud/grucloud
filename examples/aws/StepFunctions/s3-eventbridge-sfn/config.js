const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchLogs",
    "CloudWatchEvents",
    "IAM",
    "Lambda",
    "S3",
    "StepFunctions",
  ],
});
