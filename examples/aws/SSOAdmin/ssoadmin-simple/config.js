const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["IdentityStore", "Organisations", "SSOAdmin"],
});
