---
id: Resource Policy
title: ResourcePolicy
---

Provides a [Secret Manager Resource Policy](https://console.aws.amazon.com/secretsmanager/listsecrets)

## Examples


```js
exports.createResources = () => [
   {
    type: "ResourcePolicy",
    group: "SecretsManager",
    properties: ({}) => ({
      ResourcePolicy: {
        Version: "2012-10-17",
        Statement: [
          {
            Sid: "EnableAnotherAWSAccountToReadTheSecret",
            Effect: "Allow",
            Principal: {
              AWS: `arn:aws:iam::548529576214:root`,
            },
            Action: "secretsmanager:GetSecretValue",
            Resource: `*`,
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      secret: "prod/myapp/db",
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/SecretsManager/secrets-manager-simple)

## Properties

- [PutResourcePolicyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-secrets-manager/interfaces/putresourcepolicycommandinput.html)

## Dependencies

- [Secret](./Secret.md)

## Used By


## List

List the secret manager resource policy with the **ResourcePolicy** filter:

```sh
gc list -t SecretsManager::ResourcePolicy
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1 
  ✓ Initialising
  ✓ Listing 2/2
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 SecretsManager::ResourcePolicy from aws                                                                  │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: prod/myapp/db                                                                                        │
│ managedByUs: NO                                                                                            │
│ live:                                                                                                      │
│   ARN: arn:aws:secretsmanager:us-east-1:840541460064:secret:prod/myapp/db-oH2d1H                           │
│   Name: prod/myapp/db                                                                                      │
│   ResourcePolicy: {                                                                                        │
│   "Version" : "2012-10-17",                                                                                │
│   "Statement" : [ {                                                                                        │
│     "Sid" : "EnableAnotherAWSAccountToReadTheSecret",                                                      │
│     "Effect" : "Allow",                                                                                    │
│     "Principal" : {                                                                                        │
│       "AWS" : "arn:aws:iam::148529576215:root"                                                             │
│     },                                                                                                     │
│     "Action" : "secretsmanager:GetSecretValue",                                                            │
│     "Resource" : "*"                                                                                       │
│   } ]                                                                                                      │
│ }                                                                                                          │
│                                                                                                            │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                                       │
├────────────────────────────────┬──────────────────────────────────────────────────────────────────────────┤
│ SecretsManager::ResourcePolicy │ prod/myapp/db                                                            │
└────────────────────────────────┴──────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t SecretsManager::ResourcePolicy" executed in 5s, 105 MB
```
