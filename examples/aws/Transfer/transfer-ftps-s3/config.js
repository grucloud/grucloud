const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["ACM", "DirectoryService", "EC2", "IAM", "S3", "Transfer"],
});
