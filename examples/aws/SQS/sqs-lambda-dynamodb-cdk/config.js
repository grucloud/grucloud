const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["DynamoDB", "IAM", "Lambda", "SQS"],
});
