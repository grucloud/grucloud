const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "ApiGatewayV2",
    "CloudWatchLogs",
    "EC2",
    "ECS",
    "ElasticLoadBalancingV2",
  ],
});
