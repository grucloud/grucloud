const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatchEvents", "CodeBuild", "CodePipeline", "ECR", "S3"],
});
