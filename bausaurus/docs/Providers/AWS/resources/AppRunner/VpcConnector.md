---
id: VpcConnector
title: VpcConnector
---

Provides an AppRunner VpcConnector.

## Examples

```js
exports.createResources = () => [
  {
    type: "VpcConnector",
    group: "AppRunner",
    properties: ({}) => ({
      VpcConnectorName: "connector",
      VpcConnectorRevision: 1,
    }),
    dependencies: ({}) => ({
      subnets: [
        "vpc-default::subnet-default-a",
        "vpc-default::subnet-default-b",
      ],
      securityGroups: ["sg::vpc-default::default"],
    }),
  },
];
```

## Source Code Examples

- [apprunner-leaderboard](https://github.com/grucloud/grucloud/blob/main/examples/aws/AppRunner/apprunner-leaderboard/resources.js)

## Properties

- [CreateVpcConnectorCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apprunner/interfaces/createvpcconnectorcommandinput.html)

## Dependencies

- [EC2 SecurityGroup](../EC2/SecurityGroup.md)
- [EC2 Subnet](../EC2/Subnet.md)

## List

```sh
gc list -t AppRunner::VpcConnector
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 1 AppRunner::VpcConnector from aws                                               │
├──────────────────────────────────────────────────────────────────────────────────┤
│ name: connector                                                                  │
│ managedByUs: Yes                                                                 │
│ live:                                                                            │
│   CreatedAt: 2022-11-01T22:49:21.000Z                                            │
│   SecurityGroups:                                                                │
│     - "sg-4e82a670"                                                              │
│   Status: ACTIVE                                                                 │
│   Subnets:                                                                       │
│     - "subnet-b80a4ff5"                                                          │
│     - "subnet-df1ea980"                                                          │
│   VpcConnectorArn: arn:aws:apprunner:us-east-1:840541460064:vpcconnector/connec… │
│   VpcConnectorName: connector                                                    │
│   VpcConnectorRevision: 1                                                        │
│   Tags:                                                                          │
│     - Key: gc-created-by-provider                                                │
│       Value: aws                                                                 │
│     - Key: gc-managed-by                                                         │
│       Value: grucloud                                                            │
│     - Key: gc-project-name                                                       │
│       Value: apprunner-leaderboard                                               │
│     - Key: gc-stage                                                              │
│       Value: dev                                                                 │
│     - Key: Name                                                                  │
│       Value: connector                                                           │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                             │
├─────────────────────────┬───────────────────────────────────────────────────────┤
│ AppRunner::VpcConnector │ connector                                             │
└─────────────────────────┴───────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t AppRunner::VpcConnector" executed in 4s, 105 MB

```
