const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  // includeGroups: ["EC2", "ECS", "IAM", "KMS", "RDS"],
  // excludeGroups: [],
  credentials: { profile: "default" },
  partition: "aws"
});
