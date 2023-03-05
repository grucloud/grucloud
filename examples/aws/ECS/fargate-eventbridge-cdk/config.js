const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchLogs",
    "CloudWatchEvents",
    "EC2",
    "ECS",
    "ElasticLoadBalancingV2",
  ],
});
