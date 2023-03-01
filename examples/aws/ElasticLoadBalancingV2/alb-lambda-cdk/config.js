const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "ACM",
    "AutoScaling",
    "EC2",
    "ElasticLoadBalancingV2",
    "Lambda",
    "Route53",
  ],
});
