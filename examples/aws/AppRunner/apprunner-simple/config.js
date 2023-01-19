const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "AppRunner",
    "CodeStarConnections",
    "EC2",
    "ECR",
    "Route53",
    "Route53Domains",
  ],
});
