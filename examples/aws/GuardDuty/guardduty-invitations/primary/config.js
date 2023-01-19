const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["GuardDuty", "KMS", "Organisations", "S3"],
  credentials: { profile: "regionA" },
});
