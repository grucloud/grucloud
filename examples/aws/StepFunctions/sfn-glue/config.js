const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatchEvents", "Glue", "S3", "StepFunctions"],
});
