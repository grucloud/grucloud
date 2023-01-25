const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchLogs",
    "DynamoDB",
    "IAM",
    "Lambda",
    "Pipes",
    "SQS",
    "StepFunctions",
  ],
});
