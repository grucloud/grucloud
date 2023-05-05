const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "ACM",
    "EC2",
    "ElasticLoadBalancingV2",
    "IAM",
    "IdentityStore",
    "Route53",
    "SSOAdmin",
  ],
});
