const pkg = require("../package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["IAM", "KMS"],
  //credentials: { profile: "regionA" },
});
