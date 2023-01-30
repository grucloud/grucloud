const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "AutoScaling",
    "EC2",
    "ECR",
    "ECS",
    "ElasticLoadBalancingV2",
    "IAM",
    "Lambda",
    "KMS",
    "Route53",
  ],
});
