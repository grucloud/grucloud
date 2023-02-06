const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["AppSync", "IAM", "SQS", "S3"],
});
