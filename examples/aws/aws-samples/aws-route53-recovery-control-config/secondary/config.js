const pkg = require("../package.json");
// https://www.npmjs.com/package/@aws-sdk/credential-providers#fromini
module.exports = () => ({
  projectName: pkg.name,
  credentials: { profile: "regionB" },
  includeGroups: [
    "AutoScaling",
    "DynamoDB",
    "CodeBuild",
    "CodeDeploy",
    "EC2",
    "Route53",
    "Route53RecoveryControlConfig",
    "Route53RecoveryReadiness",
    "S3",
  ],
});
