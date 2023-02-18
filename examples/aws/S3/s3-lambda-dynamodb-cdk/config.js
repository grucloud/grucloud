const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatchEvents", "DynamoDB", "Lambda", "S3"],
});
