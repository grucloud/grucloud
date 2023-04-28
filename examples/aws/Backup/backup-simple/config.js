const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["Backup", "Config", "IAM", "S3"],
});
