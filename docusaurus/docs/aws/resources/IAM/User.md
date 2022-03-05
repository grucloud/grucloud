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
    name: "Alice",
    properties: ({}) => ({
      Path: "/",
    }),
    dependencies: () => ({
      policies: ["myPolicy-to-user"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "myPolicy-to-user",
    properties: ({}) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["s3:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow ec2:Describe",
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
    name: "Alice",
    properties: ({}) => ({
      Path: "/",
    }),
    dependencies: () => ({
      iamGroups: ["Admin"],
      policies: ["myPolicy-to-user"],
    }),
  },
  {
    type: "Group",
    group: "IAM",
    name: "Admin",
    properties: ({}) => ({
      Path: "/",
    }),
    dependencies: () => ({
      policies: ["myPolicy-to-group"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    name: "myPolicy-to-user",
    properties: ({}) => ({
      PolicyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: ["s3:*"],
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
      Path: "/",
      Description: "Allow ec2:Describe",
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
gc l -t IAM::User
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
