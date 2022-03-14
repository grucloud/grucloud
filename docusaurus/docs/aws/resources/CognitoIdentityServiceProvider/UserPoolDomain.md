---
id: UserPoolClient
title: User Pool Client
---

Manages a [Cognito User Pool Domain](https://console.aws.amazon.com/cognito/v2/idp/user-pools).

## Sample code

Create a user pool domain provider by Cognito:

```js
exports.createResources = () => [
  {
    type: "UserPoolDomain",
    group: "CognitoIdentityServiceProvider",
    name: "my-user-pool-domain",
    dependencies: () => ({ userPool: "my-user-pool" }),
  },
];
```

Create a user pool domain attached to a ACM certificate:

```js
exports.createResources = () => [
  {
    type: "UserPoolDomain",
    group: "CognitoIdentityServiceProvider",
    name: "auth.grucloud.org",
    dependencies: () => ({
      userPool: "my-user-pool",
      certificate: "grucloud.org",
    }),
  },
];
```

## Properties

- [CreateUserPoolDomainCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cognito-identity-provider/interfaces/createuserpooldomaincommandinput.html)

## Dependencies

- [User Pool](./UserPool.md)

## Full Examples

- [Simple user pool](https://github.com/grucloud/grucloud/tree/main/examples/aws/CognitoIdentityServiceProvider/identity-provider)

## List

The user pool domains can be filtered with the _CognitoIdentityServiceProvider::UserPoolDomain"_ type:

```sh
gc l -t CognitoIdentityServiceProvider::UserPoolDomain
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌────────────────────────────────────────────────────────────────────────┐
│ 1 CognitoIdentityServiceProvider::UserPoolDomain from aws              │
├────────────────────────────────────────────────────────────────────────┤
│ name: grucloudtest                                                     │
│ managedByUs: Yes                                                       │
│ live:                                                                  │
│   AWSAccountId: 840541460064                                           │
│   CloudFrontDistribution: d3oia8etllorh5.cloudfront.net                │
│   CustomDomainConfig:                                                  │
│   Domain: grucloudtest                                                 │
│   S3Bucket: aws-cognito-prod-iad-assets                                │
│   Status: ACTIVE                                                       │
│   UserPoolId: us-east-1_tDHdxw26v                                      │
│   Version: 20220313205736                                              │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────┐
│ aws                                                                   │
├────────────────────────────────────────────────┬──────────────────────┤
│ CognitoIdentityServiceProvider::UserPoolDomain │ grucloudtest         │
└────────────────────────────────────────────────┴──────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t CognitoIdentityServiceProvider::UserPoolDomain" executed in 4s, 131 MB
```
