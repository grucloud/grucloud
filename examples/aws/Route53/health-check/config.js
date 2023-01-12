const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatch", "Route53", "SNS"],
});
