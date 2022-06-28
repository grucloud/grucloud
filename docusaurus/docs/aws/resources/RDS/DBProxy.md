---
id: DBProxy
title: DB Proxy
---

Manages a [DB Proxy](https://console.aws.amazon.com/rds/home?#databases:).

## Example

Deploy a DB Proxy:

```js
exports.createResources = () => [
  {
    type: "DBProxy",
    group: "RDS",
    name: "rds-proxy",
    properties: ({ getId }) => ({
      EngineFamily: "MYSQL",
      Auth: [
        {
          AuthScheme: "SECRETS",
          SecretArn: `${getId({
            type: "Secret",
            group: "SecretsManager",
            name: "sam-app-cluster-secret",
          })}`,
          IAMAuth: "REQUIRED",
        },
      ],
      RequireTLS: true,
      IdleClientTimeout: 120,
      DebugLogging: false,
    }),
    dependencies: ({}) => ({
      subnets: [
        "sam-app-vpc::sam-app-prv-sub-1",
        "sam-app-vpc::sam-app-prv-sub-2",
        "sam-app-vpc::sam-app-prv-sub-3",
      ],
      securityGroups: ["sg::sam-app-vpc::sam-app-database-sg"],
      secret: ["sam-app-cluster-secret"],
      role: "sam-app-dbProxyRole-1BMIN3H39UUK3",
    }),
  },
];
```

## Code Examples

- [apigw-http-api-lambda-rds-proxy](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-http-api-lambda-rds-proxy)

## Properties

- [CreateDBProxyCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/interfaces/createdbproxycommandinput.html)

## Dependencies

- [DB Subnet Group](./DBSubnetGroup.md)
- [Security Group](../EC2/SecurityGroup.md)
- [Secret](../SecretsManager/Secret.md)
- [Role](../IAM/Role.md)

## List

```sh
gc l -t DBProxy
```

```txt

```
