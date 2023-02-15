const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatchLogs", "Lambda", "S3", "StepFunctions"],
});
