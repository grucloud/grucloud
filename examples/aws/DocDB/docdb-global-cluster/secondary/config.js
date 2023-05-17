const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["DocDB", "EC2", "IAM", "KMS", "SNS"],
  excludeResources: ["DocDB::GlobalCluster"],
  region: "us-west-2",
});
