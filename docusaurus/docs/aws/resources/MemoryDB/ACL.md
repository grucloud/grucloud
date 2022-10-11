---
id: ACL
title: ACL
---

Manages a [MemoryDB ACL](https://console.aws.amazon.com/memorydb/home?#/acls).

## Example

```js
exports.createResources = () => [
  {
    type: "ACL",
    group: "MemoryDB",
    properties: ({}) => ({
      Name: "my-acl",
    }),
    dependencies: ({}) => ({
      users: ["my-user"],
    }),
  },
];
```

## Code Examples

- [memorydb simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/MemoryDB/memorydb-simple)

## Properties

- [CreateACLCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-memorydb/interfaces/createaclcommandinput.html)

## Dependencies

- [MemoryDB User](./User.md)

## Used By

- [MemoryDB Cluster](./Cluster.md)

## List

```sh
gc l -t MemoryDB::ACL
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────┐
│ 2 MemoryDB::ACL from aws                                                 │
├──────────────────────────────────────────────────────────────────────────┤
│ name: my-acl                                                             │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   ARN: arn:aws:memorydb:us-east-1:840541460064:acl/my-acl                │
│   Clusters:                                                              │
│     - "my-cluster"                                                       │
│   MinimumEngineVersion: 6.2                                              │
│   Name: my-acl                                                           │
│   Status: active                                                         │
│   UserNames:                                                             │
│     - "my-user"                                                          │
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
│       Value: my-acl                                                      │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: open-access                                                        │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   ARN: arn:aws:memorydb:us-east-1:840541460064:acl/open-access           │
│   Clusters: []                                                           │
│   MinimumEngineVersion: 6.2                                              │
│   Name: open-access                                                      │
│   Status: active                                                         │
│   UserNames:                                                             │
│     - "default"                                                          │
│   Tags: []                                                               │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├───────────────┬─────────────────────────────────────────────────────────┤
│ MemoryDB::ACL │ my-acl                                                  │
│               │ open-access                                             │
└───────────────┴─────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t MemoryDB::ACL" executed in 3s, 100 MB
```
