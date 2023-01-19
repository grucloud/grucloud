const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "ACM",
    "CognitoIdentityServiceProvider",
    "Route53",
    "Route53Domains",
  ],
});
