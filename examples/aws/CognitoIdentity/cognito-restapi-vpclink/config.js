const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "APIGateway",
    "CognitoIdentityServiceProvider",
    "EC2",
    "ECS",
    "ElasticLoadBalancingV2",
    "Lambda",
    "IAM",
    "S3",
  ],
});
