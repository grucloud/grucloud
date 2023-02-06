const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "ApplicationAutoScaling",
    "CloudWatch",
    "EC2",
    "ECR",
    "ECS",
    "IAM",
    "SQS",
  ],
});
