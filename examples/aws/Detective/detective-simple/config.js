const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["Detective", "GuardDuty", "IAM", "Organisations"],
});
