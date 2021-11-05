---
id: IamUser
title: Iam User
---

Provides an Iam User

```js
const iamUser = provider.IAM.makeUser({
  name: "Alice",
});
```

### Add a user to groups

```js
const iamGroup = provider.IAM.makeGroup({
  name: "Admin",
});

const iamUser = provider.IAM.makeUser({
  name: "Alice",
  dependencies: () => ({ iamGroups: [iamGroup] }),
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iam/iac.js)

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
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 IamUser from aws                                                                                │
├──────────┬─────────────────────────────────────────────────────────────────────────────────┬──────┤
│ Name     │ Data                                                                            │ Our  │
├──────────┼─────────────────────────────────────────────────────────────────────────────────┼──────┤
│ grucloud │ Path: /                                                                         │ NO   │
│          │ UserName: grucloud                                                              │      │
│          │ UserId: AIDA4HNBM2ZQG52XXYCYX                                                   │      │
│          │ Arn: arn:aws:iam::840541460064:user/grucloud                                    │      │
│          │ CreateDate: 2021-04-19T18:59:01.000Z                                            │      │
│          │ Tags: []                                                                        │      │
│          │ LoginProfile:                                                                   │      │
│          │   UserName: grucloud                                                            │      │
│          │   CreateDate: 2021-04-19T18:59:02.000Z                                          │      │
│          │   PasswordResetRequired: true                                                   │      │
│          │ AccessKeys:                                                                     │      │
│          │   - UserName: grucloud                                                          │      │
│          │     AccessKeyId: AKIA4HNBM2ZQIMJ35GUF                                           │      │
│          │     Status: Active                                                              │      │
│          │     CreateDate: 2021-04-19T18:59:02.000Z                                        │      │
│          │ AttachedPolicies:                                                               │      │
│          │   - PolicyName: AdministratorAccess                                             │      │
│          │     PolicyArn: arn:aws:iam::aws:policy/AdministratorAccess                      │      │
│          │   - PolicyName: IAMUserChangePassword                                           │      │
│          │     PolicyArn: arn:aws:iam::aws:policy/IAMUserChangePassword                    │      │
│          │ Groups: []                                                                      │      │
│          │                                                                                 │      │
└──────────┴─────────────────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                              │
├────────────────────┬─────────────────────────────────────────────────────────────────────────────┤
│ IamUser            │ grucloud                                                                    │
└────────────────────┴─────────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t IamUser" executed in 3s
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
