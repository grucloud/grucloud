const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: ["AppSync", "CognitoIdentityServiceProvider", "IAM", "Lambda"],
});
