const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CloudWatchLogs",
    "CodeBuild",
    "CodePipeline",
    "CodeStarConnections",
    "S3",
  ],
});
