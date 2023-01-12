const pkg = require("./package.json");
module.exports = ({ stage, region }) => ({
  projectName: pkg.name,
  includeGroups: [
    "ACM",
    "ApiGatewayV2",
    "CloudWatchLogs",
    "Lambda",
    "Route53",
    "Route53Domains",
  ],
});
