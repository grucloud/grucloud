const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["Glacier", "IAM", "S3", "SNS"],
});
