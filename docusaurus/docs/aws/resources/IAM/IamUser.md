---
id: IamUser
title: Iam User
---

Provides an Iam User

```js
const iamUser = await provider.makeIamUser({
  name: "Alice",
  properties: () => ({}),
});
```

### Add a user to groups

```js
const iamGroup = await provider.makeIamGroup({
  name: "Admin",
  properties: () => ({}),
});

const iamUser = await provider.makeIamUser({
  name: "Alice",
  dependencies: { iamGroups: [iamGroup] },
  properties: () => ({}),
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createUser-property)

### Dependencies

- [IamGroup](./IamGroup)

### List

```sh
gc l -t IamUser
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ 1 IamUser from aws                                                                   │
├───────────────┬───────────────────────────────────────────────────────────────┬──────┤
│ Name          │ Data                                                          │ Our  │
├───────────────┼───────────────────────────────────────────────────────────────┼──────┤
│ grucloud-user │ Path: /                                                       │ NO   │
│               │ UserName: grucloud-user                                       │      │
│               │ UserId: AIDA4HNBM2ZQKBPH37UFW                                 │      │
│               │ Arn: arn:aws:iam::840541460064:user/grucloud-user             │      │
│               │ CreateDate: 2021-04-19T18:42:53.000Z                          │      │
│               │ Tags: []                                                      │      │
│               │ AttachedPolicies:                                             │      │
│               │   - PolicyName: AdministratorAccess                           │      │
│               │     PolicyArn: arn:aws:iam::aws:policy/AdministratorAccess    │      │
│               │ AccessKeys:                                                   │      │
│               │   - UserName: grucloud-user                                   │      │
│               │     AccessKeyId: AKIA4HNBM2ZQN5KTXR7K                         │      │
│               │     Status: Active                                            │      │
│               │     CreateDate: 2021-04-19T18:42:54.000Z                      │      │
│               │ Groups: []                                                    │      │
│               │                                                               │      │
└───────────────┴───────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                 │
├────────────────────┬────────────────────────────────────────────────────────────────┤
│ IamUser            │ grucloud-user                                                  │
└────────────────────┴────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t IamUser" executed in 2s
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
