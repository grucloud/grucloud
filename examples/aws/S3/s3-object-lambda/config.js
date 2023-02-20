const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["IAM", "Lambda", "S3", "S3Control"],
});
