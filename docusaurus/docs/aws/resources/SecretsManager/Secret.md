---
id: Secret
title: Secret
---

Provides a [Secret](https://console.aws.amazon.com/secretsmanager/landing)

## Examples

Create a Secret:

```js
exports.createResources = () => [
  {
    type: "Secret",
    group: "SecretsManager",
    name: "prod/myapp/db",
    properties: ({ generatePassword }) => ({
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

## Used By

- [CloudWatchEvent Connection](../CloudWatchEvents/Connection.md)
- [ECS TaskDefinition](../ECS/TaskDefinition.md)
- [Lambda Function](../Lambda/Function.md)
- [RDS DB Cluster](../RDS/DBCluster.md)
- [RDS DB Instance](../RDS/DBInstance.md)
- [RDS DB Proxy](../RDS/DBProxy.md)

## List

List the endpoints with the **Secret** filter:

```sh
gc list -t Secret
```

```txt

```
