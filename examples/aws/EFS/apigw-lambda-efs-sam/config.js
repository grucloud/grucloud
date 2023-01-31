const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["APIGateway", "ApiGatewayV2", "EC2", "EFS", "IAM", "Lambda"],
});
