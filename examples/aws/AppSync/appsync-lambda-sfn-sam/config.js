const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["AppSync", "DynamoDB", "Lambda", "S3", "StepFunctions"],
});
