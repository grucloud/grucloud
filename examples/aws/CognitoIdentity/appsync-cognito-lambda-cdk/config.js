const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "AppSync",
    "Cognito",
    "CognitoIdentityServiceProvider",
    "IAM",
    "Lambda",
    "Signer",
  ],
});
