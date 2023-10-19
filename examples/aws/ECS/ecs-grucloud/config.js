const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["EC2", "ECS", "IAM", "KMS", "S3"],
  // excludeGroups: [],
  credentials: { profile: "default" },
  partition: "aws",
});
