// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "IdentityPool",
    group: "Cognito",
    properties: ({ getId }) => ({
      AllowClassicFlow: false,
      AllowUnauthenticatedIdentities: false,
      CognitoIdentityProviders: [
        {
          ClientId: `${getId({
            type: "UserPoolClient",
            group: "CognitoIdentityServiceProvider",
            name: "my-app",
          })}`,
          ProviderName: `${getId({
            type: "UserPool",
            group: "CognitoIdentityServiceProvider",
            name: "my-pool",
            path: "live.ProviderName",
          })}`,
          ServerSideTokenCheck: false,
        },
      ],
      IdentityPoolName: "my-identity-pool",
    }),
    dependencies: ({}) => ({
      cognitoIdentityProviders: ["my-app"],
    }),
  },
  {
    type: "IdentityPoolProviderPrincipalTag",
    group: "Cognito",
    properties: ({}) => ({
      PrincipalTags: {
        client: "aud",
        username: "sub",
      },
      UseDefaults: true,
    }),
    dependencies: ({}) => ({
      identityPool: "my-identity-pool",
      cognitoUserPool: "my-pool",
    }),
  },
  {
    type: "IdentityPoolRolesAttachments",
    group: "Cognito",
    properties: ({ getId }) => ({
      Roles: {
        authenticated: `${getId({
          type: "Role",
          group: "IAM",
          name: "Cognito_myidentitypoolAuth_Role",
        })}`,
        unauthenticated: `${getId({
          type: "Role",
          group: "IAM",
          name: "Cognito_myidentitypoolUnauth_Role",
        })}`,
      },
    }),
    dependencies: ({}) => ({
      identityPool: "my-identity-pool",
      iamRoles: [
        "Cognito_myidentitypoolAuth_Role",
        "Cognito_myidentitypoolUnauth_Role",
      ],
    }),
  },
  {
    type: "UserPool",
    group: "CognitoIdentityServiceProvider",
    properties: ({}) => ({
      PoolName: "my-pool",
      UserAttributeUpdateSettings: {
        AttributesRequireVerificationBeforeUpdate: ["email"],
      },
      UsernameAttributes: ["email"],
    }),
  },
  {
    type: "UserPoolClient",
    group: "CognitoIdentityServiceProvider",
    properties: ({}) => ({
      ClientName: "my-app",
      ExplicitAuthFlows: [
        "ALLOW_CUSTOM_AUTH",
        "ALLOW_REFRESH_TOKEN_AUTH",
        "ALLOW_USER_SRP_AUTH",
      ],
      ReadAttributes: [
        "address",
        "birthdate",
        "email",
        "email_verified",
        "family_name",
        "gender",
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
        "gender",
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
    dependencies: ({}) => ({
      userPool: "my-pool",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ getId }) => ({
      RoleName: "Cognito_myidentitypoolAuth_Role",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: "cognito-identity.amazonaws.com",
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                "cognito-identity.amazonaws.com:aud": `${getId({
                  type: "IdentityPool",
                  group: "Cognito",
                  name: "my-identity-pool",
                })}`,
              },
              "ForAnyValue:StringLike": {
                "cognito-identity.amazonaws.com:amr": "authenticated",
              },
            },
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: [
                  "mobileanalytics:PutEvents",
                  "cognito-sync:*",
                  "cognito-identity:*",
                ],
                Resource: ["*"],
              },
            ],
          },
          PolicyName: "oneClick_Cognito_myidentitypoolAuth_Role_1668630580788",
        },
      ],
    }),
    dependencies: ({}) => ({
      cognitoIdentityPool: "my-identity-pool",
    }),
  },
  {
    type: "Role",
    group: "IAM",
    properties: ({ getId }) => ({
      RoleName: "Cognito_myidentitypoolUnauth_Role",
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: {
              Federated: "cognito-identity.amazonaws.com",
            },
            Action: "sts:AssumeRoleWithWebIdentity",
            Condition: {
              StringEquals: {
                "cognito-identity.amazonaws.com:aud": `${getId({
                  type: "IdentityPool",
                  group: "Cognito",
                  name: "my-identity-pool",
                })}`,
              },
              "ForAnyValue:StringLike": {
                "cognito-identity.amazonaws.com:amr": "unauthenticated",
              },
            },
          },
        ],
      },
      Policies: [
        {
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: ["mobileanalytics:PutEvents", "cognito-sync:*"],
                Resource: ["*"],
              },
            ],
          },
          PolicyName:
            "oneClick_Cognito_myidentitypoolUnauth_Role_1668630580788",
        },
      ],
    }),
    dependencies: ({}) => ({
      cognitoIdentityPool: "my-identity-pool",
    }),
  },
];
