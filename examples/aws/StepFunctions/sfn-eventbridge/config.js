const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchEvents",
    "CloudWatchLogs",
    "DynamoDB",
    "StepFunctions",
  ],
});
