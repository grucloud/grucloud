const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatchLogs", "IAM", "Route53"],
});
