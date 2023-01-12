const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  //includeGroups: ["CloudWatchLogs", "EC2", "Lambda", "StepFunctions"],
});
