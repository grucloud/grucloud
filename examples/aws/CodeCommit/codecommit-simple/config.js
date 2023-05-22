const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CodeCommit", "IAM", "Lambda", "SNS"],
});
