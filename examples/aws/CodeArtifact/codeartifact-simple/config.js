const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CodeArtifact", "IAM", "S3"],
});
