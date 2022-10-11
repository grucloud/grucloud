---
id: ParameterGroup
title: ParameterGroup
---

Manages a [MemoryDB Parameter Group](https://console.aws.amazon.com/memorydb/home?#/parameter-groups).

## Example

```js
exports.createResources = () => [
  {
    type: "ParameterGroup",
    group: "MemoryDB",
    properties: ({}) => ({
      Description: " ",
      Family: "memorydb_redis6",
      Name: "param-group",
    }),
  },
];
```

## Code Examples

- [memorydb simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/MemoryDB/memorydb-simple)

## Properties

- [CreateParameterGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-memorydb/interfaces/createparametergroupcommandinput.html)

## Used By

- [MemoryDB Cluster](./Cluster.md)

## List

```sh
gc l -t MemoryDB::ParameterGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────┐
│ 2 MemoryDB::ParameterGroup from aws                                      │
├──────────────────────────────────────────────────────────────────────────┤
│ name: default.memorydb-redis6                                            │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   ARN: arn:aws:memorydb:us-east-1:840541460064:parametergroup/default.m… │
│   Description: Default parameter group for memorydb_redis6               │
│   Family: memorydb_redis6                                                │
│   Name: default.memorydb-redis6                                          │
│   Tags: []                                                               │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: param-group                                                        │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   ARN: arn:aws:memorydb:us-east-1:840541460064:parametergroup/param-gro… │
│   Description:                                                           │
│   Family: memorydb_redis6                                                │
│   Name: param-group                                                      │
│   Tags:                                                                  │
│     - Key: gc-created-by-provider                                        │
│       Value: aws                                                         │
│     - Key: gc-managed-by                                                 │
│       Value: grucloud                                                    │
│     - Key: gc-project-name                                               │
│       Value: memorydb-simple                                             │
│     - Key: gc-stage                                                      │
│       Value: dev                                                         │
│     - Key: Name                                                          │
│       Value: param-group                                                 │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├──────────────────────────┬──────────────────────────────────────────────┤
│ MemoryDB::ParameterGroup │ default.memorydb-redis6                      │
│                          │ param-group                                  │
└──────────────────────────┴──────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t MemoryDB::ParameterGroup" executed in 4s, 100 MB
```
