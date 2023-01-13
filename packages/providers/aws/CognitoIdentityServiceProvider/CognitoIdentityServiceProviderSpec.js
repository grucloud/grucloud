const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { isOurMinion, compareAws } = require("../AwsCommon");

const {
  CognitoIdentityServiceProviderUserPool,
} = require("./CognitoIdentityServiceProviderUserPool");

const {
  CognitoIdentityServiceProviderRiskConfiguration,
} = require("./CognitoIdentityServiceProviderRiskConfiguration");

const {
  CognitoIdentityServiceProviderUserPoolClient,
} = require("./CognitoIdentityServiceProviderUserPoolClient");

const {
  CognitoIdentityServiceProviderUserPoolDomain,
} = require("./CognitoIdentityServiceProviderUserPoolDomain");

const {
  CognitoIdentityServiceProviderIdentityProvider,
} = require("./CognitoIdentityServiceProviderIdentityProvider");

const GROUP = "CognitoIdentityServiceProvider";

const compareCognitoIdentityServiceProvider = compareAws({
  tagsKey: "Tags",
});

module.exports = pipe([
  () => [
    CognitoIdentityServiceProviderIdentityProvider(),
    CognitoIdentityServiceProviderRiskConfiguration({}),
    CognitoIdentityServiceProviderUserPool(),
    CognitoIdentityServiceProviderUserPoolClient(),
    CognitoIdentityServiceProviderUserPoolDomain(),
  ],
  map(
    pipe([
      createAwsService,
      defaultsDeep({
        group: GROUP,
        isOurMinion,
        compare: compareCognitoIdentityServiceProvider({}),
      }),
    ])
  ),
]);
