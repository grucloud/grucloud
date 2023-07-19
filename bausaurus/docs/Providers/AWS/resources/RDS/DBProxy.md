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
    properties: ({ getId }) => ({
      DBProxyName: "rds-proxy",
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
      secrets: ["sam-app-cluster-secret"],
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

- [RDS DB Subnet Group](./DBSubnetGroup.md)
- [EC2 Security Group](../EC2/SecurityGroup.md)
- [SecretsManager Secret](../SecretsManager/Secret.md)
- [IAM Role](../IAM/Role.md)

## List

```sh
gc l -t RDS::DBProxy
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 RDS::DBProxy from aws                                                                 │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ name: rds-proxy                                                                         │
│ managedByUs: Yes                                                                        │
│ live:                                                                                   │
│   DBProxyName: rds-proxy                                                                │
│   DBProxyArn: arn:aws:rds:us-east-1:840541460064:db-proxy:prx-01e07ebe609058600         │
│   Status: available                                                                     │
│   EngineFamily: MYSQL                                                                   │
│   VpcId: vpc-0713c5a59061b6616                                                          │
│   VpcSecurityGroupIds:                                                                  │
│     - "sg-0aff4515ca0c4cb9f"                                                            │
│   VpcSubnetIds:                                                                         │
│     - "subnet-0ccf1b240ac0d4a19"                                                        │
│     - "subnet-0fb3a61f1d586614e"                                                        │
│     - "subnet-01a0cba4a453af7d8"                                                        │
│   Auth:                                                                                 │
│     -                                                                                   │
│       AuthScheme: SECRETS                                                               │
│       SecretArn: arn:aws:secretsmanager:us-east-1:840541460064:secret:sam-app-cluster-… │
│       IAMAuth: REQUIRED                                                                 │
│   RoleArn: arn:aws:iam::840541460064:role/sam-app-dbProxyRole-1BMIN3H39UUK3             │
│   Endpoint: rds-proxy.proxy-c8mtxauy5ngp.us-east-1.rds.amazonaws.com                    │
│   RequireTLS: true                                                                      │
│   IdleClientTimeout: 120                                                                │
│   DebugLogging: false                                                                   │
│   CreatedDate: 2022-07-31T10:43:24.093Z                                                 │
│   UpdatedDate: 2022-07-31T10:47:21.893Z                                                 │
│   Tags:                                                                                 │
│     - Key: gc-created-by-provider                                                       │
│       Value: aws                                                                        │
│     - Key: gc-managed-by                                                                │
│       Value: grucloud                                                                   │
│     - Key: gc-project-name                                                              │
│       Value: apigw-http-api-lambda-rds-proxy                                            │
│     - Key: gc-stage                                                                     │
│       Value: dev                                                                        │
│     - Key: Name                                                                         │
│       Value: rds-proxy                                                                  │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                    │
├──────────────┬─────────────────────────────────────────────────────────────────────────┤
│ RDS::DBProxy │ rds-proxy                                                               │
└──────────────┴─────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t RDS::DBProxy" executed in 5s, 112 MB
```
