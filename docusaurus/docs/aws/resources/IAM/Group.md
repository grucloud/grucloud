---
id: Group
title: Group
---

Provides an Iam Group.

This example creates a group called Admin, creates a user and add it to the group, create a policy and attach it to the group.

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
  {
    type: "Group",
    group: "IAM",
    properties: ({}) => ({
      GroupName: "Admin",
    }),
    dependencies: () => ({
      policies: ["myPolicy-to-group"],
    }),
  },
  {
    type: "Policy",
    group: "IAM",
    properties: ({}) => ({
      PolicyName: "myPolicy-to-user",
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

- [CreateGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iam/interfaces/creategroupcommandinput.html)

### Dependencies

### Used By

- [Iam Policy](./Policy.md)
- [Iam User](./User.md)
- [RAM Principal Association](../RAM/PrincipalAssociation.md)

### List

```sh
gc l -t IAM::Group
```

```sh
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 IAM::Group from aws                                                     │
├───────────────────────────────────────────────────────────────────────────┤
│ name: my-group                                                            │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   Path: /                                                                 │
│   GroupName: my-group                                                     │
│   GroupId: AGPA4HNBM2ZQP3YGZT4ZV                                          │
│   Arn: arn:aws:iam::840541460064:group/my-group                           │
│   CreateDate: 2022-08-05T21:55:07.000Z                                    │
│   AttachedPolicies:                                                       │
│     - PolicyName: AmazonEC2ReadOnlyAccess                                 │
│       PolicyArn: arn:aws:iam::aws:policy/AmazonEC2ReadOnlyAccess          │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├────────────┬─────────────────────────────────────────────────────────────┤
│ IAM::Group │ my-group                                                    │
└────────────┴─────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t IAM::Group" executed in 6s, 100 MB
```

### AWS CLI

List all iam groups

```
aws iam list-groups
```

Delete a group:

```
aws iam delete-group --group-name Admin
```
