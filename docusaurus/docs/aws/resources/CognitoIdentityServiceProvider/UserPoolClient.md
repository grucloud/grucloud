---
id: UserPoolClient
title: User Pool Client
---

Manages a [Cognito User Pool Client](https://console.aws.amazon.com/cognito/v2/idp/user-pools).

## Sample code

```js
exports.createResources = () => [
  {
    type: "UserPoolClient",
    group: "CognitoIdentityServiceProvider",
    name: "my-user-pool-client",
    properties: ({}) => ({
      IdTokenValidity: 60,
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
    dependencies: () => ({ userPool: "my-user-pool" }),
  },
];
```

## Properties

- [CreateUserPoolClientCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/interfaces/createuserpoolclientcommandinput.html)

## Dependencies

- [User Pool](./UserPool.md)

## Full Examples

- [Simple user pool](https://github.com/grucloud/grucloud/tree/main/examples/aws/CognitoIdentityServiceProvider/identity-provider)

## List

The user pool clients can be filtered with the _CognitoIdentityServiceProvider::UserPoolClient"_ type:

```sh
gc l -t CognitoIdentityServiceProvider::UserPoolClient
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 CognitoIdentityServiceProvider::UserPoolClient from aws                 │
├───────────────────────────────────────────────────────────────────────────┤
│ name: my-userpool-client                                                  │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   AccessTokenValidity: 60                                                 │
│   AllowedOAuthFlowsUserPoolClient: false                                  │
│   ClientId: 7flmflcl8mjp4k3447sger85ul                                    │
│   ClientName: my-userpool-client                                          │
│   CreationDate: 2022-03-13T17:01:28.371Z                                  │
│   EnableTokenRevocation: true                                             │
│   ExplicitAuthFlows:                                                      │
│     - "ALLOW_REFRESH_TOKEN_AUTH"                                          │
│     - "ALLOW_USER_PASSWORD_AUTH"                                          │
│   IdTokenValidity: 60                                                     │
│   LastModifiedDate: 2022-03-13T17:01:28.371Z                              │
│   PreventUserExistenceErrors: ENABLED                                     │
│   ReadAttributes:                                                         │
│     - "address"                                                           │
│     - "birthdate"                                                         │
│     - "email"                                                             │
│     - "email_verified"                                                    │
│     - "family_name"                                                       │
│     - "gender"                                                            │
│     - "given_name"                                                        │
│     - "locale"                                                            │
│     - "middle_name"                                                       │
│     - "name"                                                              │
│     - "nickname"                                                          │
│     - "phone_number"                                                      │
│     - "phone_number_verified"                                             │
│     - "picture"                                                           │
│     - "preferred_username"                                                │
│     - "profile"                                                           │
│     - "updated_at"                                                        │
│     - "website"                                                           │
│     - "zoneinfo"                                                          │
│   RefreshTokenValidity: 30                                                │
│   TokenValidityUnits:                                                     │
│     AccessToken: minutes                                                  │
│     IdToken: minutes                                                      │
│     RefreshToken: days                                                    │
│   UserPoolId: us-east-1_m1DsZWidI                                         │
│   WriteAttributes:                                                        │
│     - "address"                                                           │
│     - "birthdate"                                                         │
│     - "email"                                                             │
│     - "family_name"                                                       │
│     - "gender"                                                            │
│     - "given_name"                                                        │
│     - "locale"                                                            │
│     - "middle_name"                                                       │
│     - "name"                                                              │
│     - "nickname"                                                          │
│     - "phone_number"                                                      │
│     - "picture"                                                           │
│     - "preferred_username"                                                │
│     - "profile"                                                           │
│     - "updated_at"                                                        │
│     - "website"                                                           │
│     - "zoneinfo"                                                          │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├────────────────────────────────────────────────┬─────────────────────────┤
│ CognitoIdentityServiceProvider::UserPoolClient │ my-userpool-client      │
└────────────────────────────────────────────────┴─────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t CognitoIdentityServiceProvider::UserPoolClient" executed in 4s, 198 MB

```
