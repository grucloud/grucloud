const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["APIGateway", "EC2", "IAM", "Lambda", "SNS", "SQS"],
});
