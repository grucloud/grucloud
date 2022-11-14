const assert = require("assert");
const { assign, map, pipe, tap, eq, get } = require("rubico");
const { defaultsDeep, find } = require("rubico/x");

const { isOurMinionObject, isOurMinion, compareAws } = require("../AwsCommon");
const { UserPool } = require("./UserPool");
const { UserPoolClient } = require("./UserPoolClient");
const { UserPoolDomain } = require("./UserPoolDomain");

const { IdentityProvider } = require("./IdentityProvider");

const GROUP = "CognitoIdentityServiceProvider";

const compareCognitoIdentityServiceProvider = compareAws({
  tagsKey: "UserPoolTags",
});

const dependencyIdUserPool =
  ({ lives, config }) =>
  (live) =>
    pipe([
      () =>
        lives.getByType({
          providerName: config.providerName,
          type: "UserPool",
          group: "CognitoIdentityServiceProvider",
        }),
      find(eq(get("live.Id"), live.UserPoolId)),
      get("id"),
    ])();

module.exports = pipe([
  () => [
    {
      type: "IdentityProvider",
      inferName: get("properties.ProviderName"),
      dependencies: {
        userPool: {
          type: "UserPool",
          group: GROUP,
          parent: true,
          dependencyId: dependencyIdUserPool,
        },
      },
      Client: IdentityProvider,
    },
    {
      type: "UserPool",
      Client: UserPool,
      inferName: get("properties.Name"),
      isOurMinion: ({ live, config }) =>
        isOurMinionObject({ tags: live.UserPoolTags, config }),
      omitProperties: [
        "Arn",
        "CreationDate",
        "EstimatedNumberOfUsers",
        "LastModifiedDate",
        "Id",
        "PoolName",
        "AdminCreateUserConfig.UnusedAccountValidityDays",
        "Domain",
        "CustomDomain",
        "SchemaAttributes",
      ],
      propertiesDefault: {
        DeletionProtection: "INACTIVE",
        AccountRecoverySetting: {
          RecoveryMechanisms: [
            {
              Name: "verified_email",
              Priority: 1,
            },
            {
              Name: "verified_phone_number",
              Priority: 2,
            },
          ],
        },
        AdminCreateUserConfig: {
          AllowAdminCreateUserOnly: false,
          TemporaryPasswordValidityDays: 7,
        },
        AutoVerifiedAttributes: ["email"],
        EmailConfiguration: {
          EmailSendingAccount: "COGNITO_DEFAULT",
        },
        LambdaConfig: {},
        MfaConfiguration: "OFF",
        Policies: {
          PasswordPolicy: {
            MinimumLength: 8,
            RequireLowercase: true,
            RequireNumbers: true,
            RequireSymbols: true,
            RequireUppercase: true,
            TemporaryPasswordValidityDays: 7,
          },
        },
        UserAttributeUpdateSettings: {
          AttributesRequireVerificationBeforeUpdate: [],
        },
        UserPoolTags: {},
        UsernameConfiguration: {
          CaseSensitive: false,
        },
        VerificationMessageTemplate: {
          DefaultEmailOption: "CONFIRM_WITH_CODE",
        },
      },
    },
    {
      type: "UserPoolClient",
      Client: UserPoolClient,
      inferName: get("properties.ClientName"),
      omitProperties: [
        "ClientId",
        "UserPoolId",
        "CreationDate",
        "LastModifiedDate",
      ],
      propertiesDefault: {
        AccessTokenValidity: 60,
        AllowedOAuthFlowsUserPoolClient: false,
        EnableTokenRevocation: true,
        IdTokenValidity: 60,
        PreventUserExistenceErrors: "ENABLED",
        RefreshTokenValidity: 30,
        TokenValidityUnits: {
          AccessToken: "minutes",
          IdToken: "minutes",
          RefreshToken: "days",
        },
        EnablePropagateAdditionalUserContextData: false,
        AuthSessionValidity: 3,
      },
      dependencies: {
        userPool: {
          type: "UserPool",
          group: GROUP,
          parent: true,
          dependencyId: dependencyIdUserPool,
        },
      },
    },
    {
      type: "UserPoolDomain",
      Client: UserPoolDomain,
      inferName: get("properties.Domain"),
      omitProperties: [
        "AWSAccountId",
        "CloudFrontDistribution",
        "S3Bucket",
        "Status",
        "UserPoolId",
        "Version",
        "CustomDomainConfig",
      ],
      propertiesDefault: {},
      dependencies: {
        userPool: {
          type: "UserPool",
          group: GROUP,
          parent: true,
          dependencyId: dependencyIdUserPool,
        },
        certificate: {
          type: "Certificate",
          group: "ACM",
          dependencyId: ({ lives, config }) =>
            get("CustomDomainConfig.CertificateArn"),
        },
      },
    },
  ],
  map(
    defaultsDeep({
      group: GROUP,
      isOurMinion,
      compare: compareCognitoIdentityServiceProvider({}),
    })
  ),
]);
