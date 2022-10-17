---
id: Configuration
title: Configuration
---

Manages a [MSK Cluster V2](https://console.aws.amazon.com/msk/home#/configurations).

## Sample code

```js
exports.createResources = () => [];
```

## Properties

- [CreateConfigurationCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-kafka/interfaces/createconfigurationcommandinput.html)

## Dependencies

## Used By

- [MSK ClusterV2](../MSK/ClusterV2.md)

## Full Examples

- [msk v2 simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/MSK/msk-serverless-simple)

## List

```sh
gc l -t MSK::Configuration
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────┐
│ 1 MSK::Configuration from aws                                                 │
├───────────────────────────────────────────────────────────────────────────────┤
│ name: my-configuration                                                        │
│ managedByUs: Yes                                                              │
│ live:                                                                         │
│   Arn: arn:aws:kafka:us-east-1:840541460064:configuration/my-configuration/d… │
│   CreationTime: 2022-10-16T18:07:14.407Z                                      │
│   Revision: 1                                                                 │
│   ServerProperties: auto.create.topics.enable=false                           │
│ default.replication.factor=3                                                  │
│ min.insync.replicas=2                                                         │
│ num.io.threads=8                                                              │
│ num.network.threads=5                                                         │
│ num.partitions=1                                                              │
│ num.replica.fetchers=2                                                        │
│ replica.lag.time.max.ms=30000                                                 │
│ socket.receive.buffer.bytes=102400                                            │
│ socket.request.max.bytes=104857600                                            │
│ socket.send.buffer.bytes=102400                                               │
│ unclean.leader.election.enable=true                                           │
│ zookeeper.session.timeout.ms=18000                                            │
│                                                                               │
│   LatestRevision:                                                             │
│     CreationTime: 2022-10-16T18:07:14.407Z                                    │
│     Revision: 1                                                               │
│   Name: my-configuration                                                      │
│   State: ACTIVE                                                               │
│                                                                               │
└───────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                          │
├────────────────────┬─────────────────────────────────────────────────────────┤
│ MSK::Configuration │ my-configuration                                        │
└────────────────────┴─────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
```
