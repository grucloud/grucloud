const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["EC2", "ECS", "EFS", "IAM", "KMS", "S3"],
  credentials: { profile: "console-demo" },
  partition: "aws",
});
