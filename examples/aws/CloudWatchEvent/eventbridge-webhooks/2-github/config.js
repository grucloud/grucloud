const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["CloudWatch", "IAM", "Lambda", "SecretsManager"],
});
