const pkg = require("./package.json");
const { pipe, tap, get, not } = require("rubico");
const { isIn } = require("rubico/x");

module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "ACM",
    "AutoScaling",
    "DynamoDB",
    "EC2",
    "EKS",
    "ElastiCache",
    "ElasticLoadBalancingV2",
    "IAM",
    "KMS",
    "MQ",
    "RDS",
    "Route53",
    "Route53Domains",
    "SSM",
  ],
  filterTags: pipe([get("Key"), not(isIn(["created-by", "environment-name"]))]),
});
