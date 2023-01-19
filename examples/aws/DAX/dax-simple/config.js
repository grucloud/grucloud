const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["DAX", "DynamoDB", "EC2", "SNS"],
});
