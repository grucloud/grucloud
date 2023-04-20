const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["EC2", "ElastiCache", "IAM"],
  credentials: { profile: "regionB" },
  region: "us-west-2",
});
