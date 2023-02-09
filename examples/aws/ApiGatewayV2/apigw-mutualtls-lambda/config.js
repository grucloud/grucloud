const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "ACM",
    "ApiGatewayV2",
    "IAM",
    "Lambda",
    "Route53",
    "Route53Domains",
  ],
});
