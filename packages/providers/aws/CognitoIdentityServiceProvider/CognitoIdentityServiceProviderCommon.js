const {
  CognitoIdentityProvider,
} = require("@aws-sdk/client-cognito-identity-provider");
const { createEndpoint } = require("../AwsCommon");

exports.createCognitoIdentityProvider = createEndpoint(CognitoIdentityProvider);
