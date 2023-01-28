const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "ApiGatewayV2",
    "CloudWatchEvents",
    "CloudWatchLogs",
    "Lambda",
  ],
});
