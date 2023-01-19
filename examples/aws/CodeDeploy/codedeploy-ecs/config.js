const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CodeBuild",
    "CodeDeploy",
    "EC2",
    "ECS",
    "ElasticLoadBalancingV2",
  ],
});
