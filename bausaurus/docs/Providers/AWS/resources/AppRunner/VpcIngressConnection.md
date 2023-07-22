---
id: VpcIngressConnection
title: VpcIngressConnection
---

Provides an AppRunner VpcIngressConnection.

## Examples

```js
exports.createResources = () => [
  {
    type: "VpcIngressConnection",
    group: "AppRunner",
    properties: ({}) => ({
      VpcIngressConnectionName: "leaderboard-backend-service",
    }),
    dependencies: ({}) => ({
      service: "leaderboard-backend-service",
      vpcEndpoint: "vpc-default::vpce-apprunner",
    }),
  },
];
```

## Source Code Examples

- [apprunner-leaderboard](https://github.com/grucloud/grucloud/blob/main/examples/aws/AppRunner/apprunner-leaderboard/resources.js)

## Properties

- [CreateVpcIngressConnectionCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-apprunner/interfaces/createvpcingressconnectioncommandinput.html)

## Dependencies

- [AppRunner Service](./Service.md)
- [EC2 VpcEndpoint](../VpcEndpoint.md)

## List

```sh
gc list -t AppRunner::VpcIngressConnection
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 1 AppRunner::VpcIngressConnection from aws                                       │
├──────────────────────────────────────────────────────────────────────────────────┤
│ name: leaderboard-backend-service                                                │
│ managedByUs: Yes                                                                 │
│ live:                                                                            │
│   AccountId: ****************                                                    │
│   CreatedAt: 2022-11-03T02:06:05.000Z                                            │
│   DomainName: 7wgvahyijq.us-east-1.awsapprunner.com                              │
│   IngressVpcConfiguration:                                                       │
│     VpcEndpointId: vpce-097bcd123874e4cd5                                        │
│     VpcId: vpc-faff3987                                                          │
│   ServiceArn: arn:aws:apprunner:us-east-1:840541460064:service/leaderboard-back… │
│   Status: FAILED_CREATION                                                        │
│   VpcIngressConnectionArn: arn:aws:apprunner:us-east-1:840541460064:vpcingressc… │
│   VpcIngressConnectionName: leaderboard-backend-service                          │
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
│       Value: leaderboard-backend-service                                         │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                             │
├─────────────────────────────────┬───────────────────────────────────────────────┤
│ AppRunner::VpcIngressConnection │ leaderboard-backend-service                   │
└─────────────────────────────────┴───────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t AppRunner::VpcIngressConnection" executed in 4s, 106 MB
```
