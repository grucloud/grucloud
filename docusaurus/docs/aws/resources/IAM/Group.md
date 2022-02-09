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

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createGroup-property)

### Dependencies

### Used By

- [IamPolicy](./Policy.md)
- [IamUser](./User.md)

### List

```sh
gc l -t IamGroup
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 IamGroup from aws                                                                          │
├──────────┬────────────────────────────────────────────────────────────────────────────┬──────┤
│ Name     │ Data                                                                       │ Our  │
├──────────┼────────────────────────────────────────────────────────────────────────────┼──────┤
│ Admin    │ Path: /                                                                    │ Yes  │
│          │ GroupName: Admin                                                           │      │
│          │ GroupId: AGPA4HNBM2ZQAA5U7GCZY                                             │      │
│          │ Arn: arn:aws:iam::840541460064:group/Admin                                 │      │
│          │ CreateDate: 2021-04-19T17:38:37.000Z                                       │      │
│          │ AttachedPolicies:                                                          │      │
│          │   - PolicyName: myPolicy-to-group                                          │      │
│          │     PolicyArn: arn:aws:iam::840541460064:policy/myPolicy-to-group          │      │
│          │                                                                            │      │
└──────────┴────────────────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├────────────────────┬────────────────────────────────────────────────────────────────────────┤
│ IamGroup           │ Admin                                                                  │
└────────────────────┴────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t IamGroup" executed in 3s
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
