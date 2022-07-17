// Generated by 'gc gencode'
const {} = require("rubico");
const {} = require("rubico/x");

exports.createResources = () => [
  {
    type: "Certificate",
    group: "ACM",
    name: "grucloud.org",
    properties: ({}) => ({
      SubjectAlternativeNames: ["grucloud.org", "*.grucloud.org"],
    }),
  },
  {
    type: "UserPool",
    group: "CognitoIdentityServiceProvider",
    name: "my-user-pool",
    properties: ({}) => ({
      Policies: {
        PasswordPolicy: {
          MinimumLength: 10,
          TemporaryPasswordValidityDays: 10,
        },
      },
      UserPoolTags: {
        mykey: "myvalue",
      },
    }),
  },
  {
    type: "UserPoolClient",
    group: "CognitoIdentityServiceProvider",
    name: "my-userpool-client",
    properties: ({}) => ({
      AllowedOAuthFlows: ["code"],
      AllowedOAuthFlowsUserPoolClient: true,
      AllowedOAuthScopes: ["openid"],
      CallbackURLs: ["https://localhost:3000/login_callback"],
      ExplicitAuthFlows: [
        "ALLOW_REFRESH_TOKEN_AUTH",
        "ALLOW_USER_PASSWORD_AUTH",
      ],
      LogoutURLs: ["https://localhost:3000/logout_callback"],
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
      SupportedIdentityProviders: ["COGNITO"],
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
      userPool: "my-user-pool",
    }),
  },
  {
    type: "UserPoolDomain",
    group: "CognitoIdentityServiceProvider",
    name: "auth.grucloud.org",
    dependencies: ({}) => ({
      userPool: "my-user-pool",
      certificate: "grucloud.org",
    }),
  },
  {
    type: "HostedZone",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
    }),
    dependencies: ({}) => ({
      domain: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    properties: ({}) => ({
      Name: "grucloud.org.",
      Type: "A",
      TTL: 300,
      ResourceRecords: [
        {
          Value: "127.0.0.1",
        },
      ],
    }),
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
      certificate: "grucloud.org",
    }),
  },
  {
    type: "Record",
    group: "Route53",
    dependencies: ({}) => ({
      hostedZone: "grucloud.org.",
      userPoolDomain: "auth.grucloud.org",
    }),
  },
  {
    type: "Domain",
    group: "Route53Domains",
    name: "grucloud.org",
    readOnly: true,
  },
];
