---
id: UserPool
title: User Pool
---

Manages a [Cognito User Pool](https://console.aws.amazon.com/cognito/v2/idp/user-pools).

## Sample code

```js
exports.createResources = () => [
  {
    type: "UserPool",
    group: "CognitoIdentityServiceProvider",
    properties: () => ({
      PoolName: "my-user-pool",
      Tags: {
        mykey1: "myvalue",
      },
    }),
  },
];
```

## Properties

- [CreateUserPoolCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/interfaces/createuserpoolcommandinput.html)

## Dependencies

- [Identity Provider](./IdentityProvider.md)

## Used By

- [User Pool Client](./UserPoolClient.md)

## Full Examples

- [Simple user pool](https://github.com/grucloud/grucloud/tree/main/examples/aws/CognitoIdentityServiceProvider/identity-provider)
- [serverless-patterns cognito-httpapi](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/cognito-httpapi)

## List

The user pools can be filtered with the _UserPool_ type:

```sh
gc l -t UserPool
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────┐
│ 1 CognitoIdentityServiceProvider::UserPool from aws                 │
├─────────────────────────────────────────────────────────────────────┤
│ name: my-user-pool                                                  │
│ managedByUs: Yes                                                    │
│ live:                                                               │
│   AccountRecoverySetting:                                           │
│     RecoveryMechanisms:                                             │
│       - Name: verified_email                                        │
│         Priority: 1                                                 │
│       - Name: verified_phone_number                                 │
│         Priority: 2                                                 │
│   AdminCreateUserConfig:                                            │
│     AllowAdminCreateUserOnly: false                                 │
│     UnusedAccountValidityDays: 7                                    │
│   Arn: arn:aws:cognito-idp:us-east-1:840541460064:userpool/us-east… │
│   AutoVerifiedAttributes:                                           │
│     - "email"                                                       │
│   CreationDate: 2022-03-13T15:49:14.632Z                            │
│   EmailConfiguration:                                               │
│     EmailSendingAccount: COGNITO_DEFAULT                            │
│   EstimatedNumberOfUsers: 0                                         │
│   Id: us-east-1_fQ74O4Y78                                           │
│   LambdaConfig:                                                     │
│   LastModifiedDate: 2022-03-13T15:49:14.632Z                        │
│   MfaConfiguration: OFF                                             │
│   Name: my-user-pool                                                │
│   Policies:                                                         │
│     PasswordPolicy:                                                 │
│       MinimumLength: 8                                              │
│       RequireLowercase: true                                        │
│       RequireNumbers: true                                          │
│       RequireSymbols: true                                          │
│       RequireUppercase: true                                        │
│       TemporaryPasswordValidityDays: 7                              │
│   SchemaAttributes:                                                 │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: false                                                │
│       Name: sub                                                     │
│       Required: true                                                │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 1                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: name                                                    │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: given_name                                              │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: family_name                                             │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: middle_name                                             │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: nickname                                                │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: preferred_username                                      │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: profile                                                 │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: picture                                                 │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: website                                                 │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: email                                                   │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: Boolean                                    │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: email_verified                                          │
│       Required: false                                               │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: gender                                                  │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: birthdate                                               │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 10                                               │
│         MinLength: 10                                               │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: zoneinfo                                                │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: locale                                                  │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: phone_number                                            │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: Boolean                                    │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: phone_number_verified                                   │
│       Required: false                                               │
│     - AttributeDataType: String                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: address                                                 │
│       Required: false                                               │
│       StringAttributeConstraints:                                   │
│         MaxLength: 2048                                             │
│         MinLength: 0                                                │
│     - AttributeDataType: Number                                     │
│       DeveloperOnlyAttribute: false                                 │
│       Mutable: true                                                 │
│       Name: updated_at                                              │
│       NumberAttributeConstraints:                                   │
│         MinValue: 0                                                 │
│       Required: false                                               │
│   Tags:                                                             │
│     Name: my-user-pool                                              │
│     gc-created-by-provider: aws                                     │
│     gc-managed-by: grucloud                                         │
│     gc-project-name: identity-provider                              │
│     gc-stage: dev                                                   │
│     mykey: myvalue                                                  │
│   UsernameConfiguration:                                            │
│     CaseSensitive: false                                            │
│   VerificationMessageTemplate:                                      │
│     DefaultEmailOption: CONFIRM_WITH_CODE                           │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────┐
│ aws                                                                │
├──────────────────────────────────────────┬─────────────────────────┤
│ CognitoIdentityServiceProvider::UserPool │ my-user-pool            │
└──────────────────────────────────────────┴─────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t UserPool" executed in 4s, 213 MB
```
