---
id: User
title: User
---

Manages an [ElastiCache User](https://console.aws.amazon.com/elasticache/home#/users).

## Sample code

```js
exports.createResources = () => [
  {
    type: "User",
    group: "ElastiCache",
    properties: ({}) => ({
      UserId: "myuser",
      UserName: "myuser",
      Engine: "redis",
      AccessString: "on ~* +@all",
      Authentication: {
        Type: "password",
        Passwords: JSON.parse(process.env.MYUSER_ELASTICACHE_USER_PASSWORDS),
      },
    }),
  },
];
```

## Properties

- [CreateUserCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elasticache/interfaces/createusercommandinput.html)

## Used By

- [ElastiCache UserGroup](../ElastiCache/UserGroup.md)

## Full Examples

- [elasticache redis-full](https://github.com/grucloud/grucloud/tree/main/examples/aws/ElastiCache/elasticache-redis-full)

## List

```sh
gc l -t ElastiCache::User
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────┐
│ 1 ElastiCache::User from aws                                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│ name: default                                                                   │
│ managedByUs: NO                                                                 │
│ live:                                                                           │
│   UserId: default                                                               │
│   UserName: default                                                             │
│   Status: active                                                                │
│   Engine: redis                                                                 │
│   MinimumEngineVersion: 6.0                                                     │
│   AccessString: on ~* +@all                                                     │
│   UserGroupIds: []                                                              │
│   Authentication:                                                               │
│     Type: no-password                                                           │
│   ARN: arn:aws:elasticache:us-east-1:840541460064:user:default                  │
│   Tags: []                                                                      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                            │
├───────────────────┬────────────────────────────────────────────────────────────┤
│ ElastiCache::User │ default                                                    │
└───────────────────┴────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ElastiCache::User" executed in 3s, 103 MB
```
