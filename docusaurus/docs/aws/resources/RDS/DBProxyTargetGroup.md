---
id: DBProxyTargetGroup
title: DB Proxy Target Group
---

Manages a [DB Proxy Target Group](https://console.aws.amazon.com/rds/home?#databases:).

## Example

Deploy a DB Proxy Target Group:

```js
exports.createResources = () => [
```

## Code Examples

- [apigw-http-api-lambda-rds-proxy](https://github.com/grucloud/grucloud/tree/main/examples/aws/serverless-patterns/apigw-http-api-lambda-rds-proxy)

## Properties

- [RegisterDBProxyTargetsRequest](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-rds/modules/registerdbproxytargetsrequest.html)

## Dependencies

## List

```sh
gc l -t RDS::DBProxyTargetGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 2/2
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 RDS::DBProxyTargetGroup from aws                                                      │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│ name: default                                                                           │
│ managedByUs: NO                                                                         │
│ live:                                                                                   │
│   DBProxyName: rds-proxy                                                                │
│   TargetGroupName: default                                                              │
│   TargetGroupArn: arn:aws:rds:us-east-1:840541460064:target-group:prx-tg-09cfba247a764… │
│   IsDefault: true                                                                       │
│   Status: available                                                                     │
│   ConnectionPoolConfig:                                                                 │
│     MaxConnectionsPercent: 100                                                          │
│     MaxIdleConnectionsPercent: 50                                                       │
│     ConnectionBorrowTimeout: 120                                                        │
│     SessionPinningFilters: []                                                           │
│   CreatedDate: 2022-07-31T10:43:24.093Z                                                 │
│   Tags: []                                                                              │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                    │
├─────────────────────────┬──────────────────────────────────────────────────────────────┤
│ RDS::DBProxyTargetGroup │ default                                                      │
└─────────────────────────┴──────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t RDS::DBProxyTargetGroup" executed in 8s, 117 MB
```
