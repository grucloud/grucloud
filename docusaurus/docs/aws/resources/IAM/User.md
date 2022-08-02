---
id: User
title: User
---

Provides an Iam User

```js
exports.createResources = () => [
  {
    type: "User",
    group: "IAM",
    properties: ({}) => ({
      UserName: "Alice",
    }),
    dependencies: () => ({
      policies: ["myPolicy-to-user"],
    }),
  },
];
```

### Add a user to groups

```js
exports.createResources = () => [
  {
    type: "User",
    group: "IAM",
    properties: ({}) => ({
      UserName: "Alice",
    }),
    dependencies: () => ({
      iamGroups: ["Admin"],
      policies: ["myPolicy-to-user"],
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/IAM/iam)

### Properties

- [CreateUserCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iam/interfaces/createusercommandinput.html)

### Dependencies

- [Iam Group](./Group.md)

### List

```sh
gc l -t User
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────┐
│ 1 IAM::User from aws                                             │
├──────────────────────────────────────────────────────────────────┤
│ name: my-test-user                                               │
│ managedByUs: Yes                                                 │
│ live:                                                            │
│   Path: /                                                        │
│   UserName: my-test-user                                         │
│   UserId: AIDA4HNBM2ZQBULNO5DHK                                  │
│   Arn: arn:aws:iam::840541460064:user/my-test-user               │
│   CreateDate: 2022-03-09T03:50:15.000Z                           │
│   Tags:                                                          │
│     - Key: gc-created-by-provider                                │
│       Value: aws                                                 │
│     - Key: gc-managed-by                                         │
│       Value: grucloud                                            │
│     - Key: gc-project-name                                       │
│       Value: iam-user                                            │
│     - Key: gc-stage                                              │
│       Value: dev                                                 │
│     - Key: mytag                                                 │
│       Value: myvalue                                             │
│     - Key: Name                                                  │
│       Value: my-test-user                                        │
│   AttachedPolicies: []                                           │
│   AccessKeys: []                                                 │
│   Groups: []                                                     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────┐
│ aws                                                             │
├───────────┬─────────────────────────────────────────────────────┤
│ IAM::User │ my-test-user                                        │
└───────────┴─────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t User" executed in 5s, 209 MB
```

### AWS CLI

List all iam users

```
aws iam list-users
```

List the tags for a given user

```
aws iam list-user-tags --user-name Alice

```

Delete a user:

```
aws iam delete-user --user-name Alice
```
