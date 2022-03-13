const { assign, map, pipe, tap } = require("rubico");
const { defaultsDeep } = require("rubico/x");

const { isOurMinionObject, compareAws } = require("../AwsCommon");
const { UserPool } = require("./UserPool");
const {
  IdentityProvider,
  compareIdentityProvider,
} = require("./IdentityProvider");

const isOurMinion = ({ live, config }) =>
  isOurMinionObject({ tags: live.tags, config });

const GROUP = "CognitoIdentityServiceProvider";

const compareCognitoIdentityServiceProvider = compareAws({
  tagsKey: "UserPoolTags",
});

module.exports = pipe([
  () => [
    {
      type: "UserPool",
      Client: UserPool,
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
      ],
      propertiesDefault: {
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
        Name: "my-user-pool",
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
        SchemaAttributes: [
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: false,
            Name: "sub",
            Required: true,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "1",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "name",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "given_name",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "family_name",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "middle_name",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "nickname",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "preferred_username",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "profile",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "picture",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "website",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "email",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "Boolean",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "email_verified",
            Required: false,
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "gender",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "birthdate",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "10",
              MinLength: "10",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "zoneinfo",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "locale",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "phone_number",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "Boolean",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "phone_number_verified",
            Required: false,
          },
          {
            AttributeDataType: "String",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "address",
            Required: false,
            StringAttributeConstraints: {
              MaxLength: "2048",
              MinLength: "0",
            },
          },
          {
            AttributeDataType: "Number",
            DeveloperOnlyAttribute: false,
            Mutable: true,
            Name: "updated_at",
            NumberAttributeConstraints: {
              MinValue: "0",
            },
            Required: false,
          },
        ],
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
      type: "IdentityProvider",
      dependencies: {
        userPool: { type: "UserPool", group: "CognitoIdentityServiceProvider" },
      },
      Client: IdentityProvider,
      compareIdentity: compareIdentityProvider,
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
