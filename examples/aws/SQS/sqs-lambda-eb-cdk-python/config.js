const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatchEvents", "IAM", "Lambda", "SQS"],
});
