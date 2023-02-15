// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "UserPool",
    group: "CognitoIdentityServiceProvider",
    properties: () => ({
      PoolName: "my-user-pool",
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
          TemporaryPasswordValidityDays: 8,
        },
      },
      Tags: {
        mykey1: "myvalue",
      },
    }),
  },
  {
    type: "UserPoolClient",
    group: "CognitoIdentityServiceProvider",
    properties: ({}) => ({
      ClientName: "my-userpool-client",
      IdTokenValidity: 50,
      ExplicitAuthFlows: [
        "ALLOW_REFRESH_TOKEN_AUTH",
        "ALLOW_USER_PASSWORD_AUTH",
      ],
      ReadAttributes: [
        "address",
        "birthdate",
        "email",
        "email_verified",
        "family_name",
        "given_name",
        "locale",
        "middle_name",
        "name",
        "nickname",
        "phone_number",
        "phone_number_verified",
        "picture",
        "preferred_username",
        "profile",
        "updated_at",
        "website",
        "zoneinfo",
      ],
      WriteAttributes: [
        "address",
        "birthdate",
        "email",
        "family_name",
        "given_name",
        "locale",
        "middle_name",
        "name",
        "nickname",
        "phone_number",
        "picture",
        "preferred_username",
        "profile",
        "updated_at",
        "website",
        "zoneinfo",
      ],
    }),
    dependencies: () => ({
      userPool: "my-user-pool",
    }),
  },
];