const pkg = require("./package.json");
module.exports = () => ({
  projectName: pkg.name,
  includeGroups: [
    "Amplify",
    "APIGateway",
    "Cognito",
    "CognitoIdentityServiceProvider",
    "Lambda",
  ],
});
