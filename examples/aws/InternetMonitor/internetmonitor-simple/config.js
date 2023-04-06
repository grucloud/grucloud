const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudFront", "InternetMonitor", "EC2", "Workspaces"],
});
