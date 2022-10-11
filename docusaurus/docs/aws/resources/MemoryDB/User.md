---
id: User
title: User
---

Manages a [MemoryDB User](https://console.aws.amazon.com/memorydb/home?#/users).

## Example

```js
exports.createResources = () => [
  {
    type: "User",
    group: "MemoryDB",
    properties: ({}) => ({
      AccessString: "on ~* &* +@all",
      Name: "my-user",
      AuthenticationMode: {
        Passwords: JSON.parse(process.env.MY_USER_MEMORYDB_USER_PASSWORDS),
      },
    }),
  },
];
```

## Code Examples

- [memorydb simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/MemoryDB/memorydb-simple)

## Properties

- [CreateUserCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-memorydb/interfaces/createusercommandinput.html)

## Used By

- [MemoryDB ACL](./ACL.md)

## List

```sh
gc l -t MemoryDB::User
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────────┐
│ 2 MemoryDB::User from aws                                                │
├──────────────────────────────────────────────────────────────────────────┤
│ name: default                                                            │
│ managedByUs: NO                                                          │
│ live:                                                                    │
│   ACLNames:                                                              │
│     - "open-access"                                                      │
│   ARN: arn:aws:memorydb:us-east-1:840541460064:user/default              │
│   AccessString: on ~* &* +@all                                           │
│   Authentication:                                                        │
│     Type: no-password                                                    │
│   MinimumEngineVersion: 6.0                                              │
│   Name: default                                                          │
│   Status: active                                                         │
│   Tags: []                                                               │
│                                                                          │
├──────────────────────────────────────────────────────────────────────────┤
│ name: my-user                                                            │
│ managedByUs: Yes                                                         │
│ live:                                                                    │
│   ACLNames:                                                              │
│     - "my-acl"                                                           │
│   ARN: arn:aws:memorydb:us-east-1:840541460064:user/my-user              │
│   AccessString: on ~* &* +@all                                           │
│   Authentication:                                                        │
│     PasswordCount: 1                                                     │
│     Type: password                                                       │
│   MinimumEngineVersion: 6.2                                              │
│   Name: my-user                                                          │
│   Status: active                                                         │
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
│       Value: my-user                                                     │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────┐
│ aws                                                                     │
├────────────────┬────────────────────────────────────────────────────────┤
│ MemoryDB::User │ default                                                │
│                │ my-user                                                │
└────────────────┴────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t MemoryDB::User" executed in 3s, 100 MB

```
