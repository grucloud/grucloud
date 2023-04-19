const assert = require("assert");
const { map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");
const { createAwsService } = require("../AwsService");

const { compareAws } = require("../AwsCommon");

const {
  CognitoIdentityServiceProviderGroup,
} = require("./CognitoIdentityServiceProviderGroup");

const {
  CognitoIdentityServiceProviderUserPool,
} = require("./CognitoIdentityServiceProviderUserPool");

const {
  CognitoIdentityServiceProviderResourceServer,
} = require("./CognitoIdentityServiceProviderResourceServer");

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
    CognitoIdentityServiceProviderGroup(),
    CognitoIdentityServiceProviderIdentityProvider(),
    CognitoIdentityServiceProviderResourceServer({}),
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
        compare: compareCognitoIdentityServiceProvider({}),
      }),
    ])
  ),
]);
