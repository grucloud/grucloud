const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["EC2", "ElasticLoadBalancingV2", "Route53"],
});
