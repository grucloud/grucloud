const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["EC2", "EFS", "IAM", "Route53", "Transfer"],
});
