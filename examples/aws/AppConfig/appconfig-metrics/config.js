const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["AppConfig", "CloudWatch", "CloudWatchLogs", "SNS"],
});
