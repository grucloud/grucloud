const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "CodeCommit",
    "CodeGuruReviewer",
    "CodeStarConnections",
    "IAM",
    "KMS",
    "S3",
  ],
});
