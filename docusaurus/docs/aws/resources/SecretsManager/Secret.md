---
id: Secret
title: Secret
---

Provides a [Secret](https://console.aws.amazon.com/secretsmanager/listsecrets)

## Examples

Create a Secret:

```js
exports.createResources = () => [
  {
    type: "Secret",
    group: "SecretsManager",
    properties: ({ generatePassword }) => ({
      Name: "prod/myapp/db",
      SecretString: {
        password: generatePassword({ length: 32 }),
        username: "demousername",
      },
      Description: "access postgres",
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
  },
];
```

## Source Code Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/SecretsManager/secrets-manager-simple)

- [apigw-http-api-lambda-rds-proxy](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-http-api-lambda-rds-proxy)

- [auroraserverless-secretsmanager](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/auroraserverless-secretsmanager)

- [fargate-aurora-serverless-cdk](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/fargate-aurora-serverless-cdk)

- [lambda-aurora-serverless](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/lambda-aurora-serverless)

## Properties

- [CreateSecretCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-secrets-manager/interfaces/createsecretcommandinput.html)

## Dependencies

- [KMS Key](../KMS/Key.md)

## Used By

- [Resource Policy](./ResourcePolicy.md)
- [CloudWatchEvent Connection](../CloudWatchEvents/Connection.md)
- [ECS TaskDefinition](../ECS/TaskDefinition.md)
- [Lambda Function](../Lambda/Function.md)
- [RDS DB Cluster](../RDS/DBCluster.md)
- [RDS DB Instance](../RDS/DBInstance.md)
- [RDS DB Proxy](../RDS/DBProxy.md)

## List

List the secrets with the **Secret** filter:

```sh
gc list -t Secret
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 SecretsManager::Secret from aws                                                           │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: prod/myapp/db                                                                         │
│ managedByUs: Yes                                                                            │
│ live:                                                                                       │
│   SecretString:                                                                             │
│     password: ****************                                                              │
│     username: demousername                                                                  │
│   ARN: arn:aws:secretsmanager:us-east-1:840541460064:secret:prod/myapp/db-oH2d1H            │
│   CreatedDate: 2022-03-28T00:08:11.960Z                                                     │
│   Description: access postgres                                                              │
│   LastAccessedDate: 2022-07-18T00:00:00.000Z                                                │
│   LastChangedDate: 2022-07-18T09:23:23.707Z                                                 │
│   Name: prod/myapp/db                                                                       │
│   SecretVersionsToStages:                                                                   │
│     35b793c3-77fc-414e-a7b8-e8f685626de6:                                                   │
│       - "AWSCURRENT"                                                                        │
│     b5a2d97d-5cdb-4ffe-b5fe-f1d16a7f94af:                                                   │
│       - "AWSPREVIOUS"                                                                       │
│   Tags:                                                                                     │
│     - Key: gc-created-by-provider                                                           │
│       Value: aws                                                                            │
│     - Key: gc-managed-by                                                                    │
│       Value: grucloud                                                                       │
│     - Key: gc-project-name                                                                  │
│       Value: secrets-manager-simple                                                         │
│     - Key: gc-stage                                                                         │
│       Value: dev                                                                            │
│     - Key: mykey                                                                            │
│       Value: myvalue                                                                        │
│     - Key: Name                                                                             │
│       Value: prod/myapp/db                                                                  │
│                                                                                             │
└─────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                        │
├────────────────────────┬───────────────────────────────────────────────────────────────────┤
│ SecretsManager::Secret │ prod/myapp/db                                                     │
└────────────────────────┴───────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t Secret" executed in 4s, 110 MB
```
