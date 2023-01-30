const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["ApiGatewayV2", "EC2", "EFS", "IAM", "Lambda"],
});
