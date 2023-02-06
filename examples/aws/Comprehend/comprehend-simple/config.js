const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["Comprehend", "EC2", "IAM", "S3"],
});
