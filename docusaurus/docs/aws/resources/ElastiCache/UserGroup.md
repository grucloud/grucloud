---
id: UserGroup
title: UserGroup
---

Manages an [ElastiCache User Group](https://console.aws.amazon.com/elasticache/home#/user-groups).

## Sample code

```js
exports.createResources = () => [];
```

## Properties

- [CreateUserGroupGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elasticache/interfaces/createusergroupcommandinput.html)

## Dependencies

- [ElastiCache UserGroup](../ElastiCache/UserGroup.md)

## Full Examples

- [elasticache simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/ElastiCache/elasticache-simple)

## List

```sh
gc l -t ElastiCache::UserGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 1 ElastiCache::UserGroup from aws                                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ name: mygroup                                                                       │
│ managedByUs: Yes                                                                    │
│ live:                                                                               │
│   UserGroupId: mygroup                                                              │
│   Status: active                                                                    │
│   Engine: redis                                                                     │
│   UserIds:                                                                          │
│     - "myuser"                                                                      │
│     - "default"                                                                     │
│   MinimumEngineVersion: 6.0                                                         │
│   ReplicationGroups: []                                                             │
│   ARN: arn:aws:elasticache:us-east-1:840541460064:usergroup:mygroup                 │
│   Tags:                                                                             │
│     - Key: mykey                                                                    │
│       Value: myvalue                                                                │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                │
├────────────────────────┬───────────────────────────────────────────────────────────┤
│ ElastiCache::UserGroup │ mygroup                                                   │
└────────────────────────┴───────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ElastiCache::UserGroup" executed in 3s, 104 MB
```
