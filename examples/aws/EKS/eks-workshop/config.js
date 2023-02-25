const pkg = require("./package.json");
const { pipe, tap, get, not } = require("rubico");
const { isIn } = require("rubico/x");

module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "Aps",
    "ACM",
    "AutoScaling",
    "Cloud9",
    "CloudWatchEvents",
    "DynamoDB",
    "EC2",
    "EFS",
    "EKS",
    "ElasticLoadBalancingV2",
    "Grafana",
    "IAM",
    "KMS",
    "Lambda",
    "RDS",
    "Route53",
    "Route53Domains",
    "SecretsManager",
    "SQS",
    "SSM",
  ],
  filterTags: pipe([get("Key"), not(isIn(["created-by", "env"]))]),
});
