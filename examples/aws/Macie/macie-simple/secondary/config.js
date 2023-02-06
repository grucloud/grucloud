const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["IAM", "Macie", "Organisations", "S3"],
  credentials: { profile: "account_secondary" },
});
