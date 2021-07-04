---
id: IamRole
title: Iam Role
---

Provides an Iam Role.

```js
const iamRole = provider.iam.makeRole({
  name: "my-role",
  properties: () => ({
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "sts:AssumeRole",
          Principal: {
            Service: "ec2.amazonaws.com",
          },
          Effect: "Allow",
          Sid: "",
        },
      ],
    },
  }),
});
```

### Add a policy to a role

```js
const iamPolicy = provider.iam.makePolicy({
  name: "my-policy",
  properties: () => ({
    PolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: ["ec2:Describe*"],
          Effect: "Allow",
          Resource: "*",
        },
      ],
    },
    Description: "Allow ec2:Describe",
    Path: "/",
  }),
});

const iamRole = provider.iam.makeRole({
  name: "my-role",
  dependencies: { policies: [iamPolicy] },

  properties: () => ({
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "sts:AssumeRole",
          Principal: {
            Service: "ec2.amazonaws.com",
          },
          Effect: "Allow",
          Sid: "",
        },
      ],
    },
  }),
});
```

### Add a role to an instance profile

```js
const iamRole = provider.iam.makeRole({
  name: "my-role",
  properties: () => ({
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "sts:AssumeRole",
          Principal: {
            Service: "ec2.amazonaws.com",
          },
          Effect: "Allow",
          Sid: "",
        },
      ],
    },
  }),
});

const iamInstanceProfile = provider.iam.makeInstanceProfile({
  name: "my-instance-profile",
  dependencies: { iamRoles: [iamRole] },
  properties: () => ({}),
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property)

### Dependencies

- [IamInstanceProfile](./IamInstanceProfile)

### Used By

- [IamPolicy](./IamPolicy)
- [IamPolicyReadOnly](./IamPolicyReadOnly)

### List

```sh
gc list -t IamRole
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 IamRole from aws                                                                           │
├────────────────────────┬──────────────────────────────────────────────────────────────┬──────┤
│ Name                   │ Data                                                         │ Our  │
├────────────────────────┼──────────────────────────────────────────────────────────────┼──────┤
│ role-allow-assume-role │ Path: /                                                      │ Yes  │
│                        │ RoleName: role-allow-assume-role                             │      │
│                        │ RoleId: AROA4HNBM2ZQAT5MU5E5F                                │      │
│                        │ Arn: arn:aws:iam::840541460064:role/role-allow-assume-role   │      │
│                        │ CreateDate: 2021-04-19T17:38:37.000Z                         │      │
│                        │ AssumeRolePolicyDocument:                                    │      │
│                        │   Version: 2012-10-17                                        │      │
│                        │   Statement:                                                 │      │
│                        │     - Sid:                                                   │      │
│                        │       Effect: Allow                                          │      │
│                        │       Principal:                                             │      │
│                        │         Service: ec2.amazonaws.com                           │      │
│                        │       Action: sts:AssumeRole                                 │      │
│                        │ MaxSessionDuration: 3600                                     │      │
│                        │ Tags:                                                        │      │
│                        │   - Key: Name                                                │      │
│                        │     Value: role-allow-assume-role                            │      │
│                        │   - Key: ManagedBy                                           │      │
│                        │     Value: GruCloud                                          │      │
│                        │   - Key: CreatedByProvider                                   │      │
│                        │     Value: aws                                               │      │
│                        │   - Key: stage                                               │      │
│                        │     Value: dev                                               │      │
│                        │   - Key: projectName                                         │      │
│                        │     Value: @grucloud/example-aws-iam                         │      │
│                        │ Policies: []                                                 │      │
│                        │ InstanceProfiles:                                            │      │
│                        │   - InstanceProfileName: my-profile                          │      │
│                        │     InstanceProfileId: AIPA4HNBM2ZQN3SFYOLNT                 │      │
│                        │     Arn: arn:aws:iam::840541460064:instance-profile/my-prof… │      │
│                        │     Path: /                                                  │      │
│                        │ AttachedPolicies:                                            │      │
│                        │   - PolicyName: myPolicy-to-role                             │      │
│                        │     PolicyArn: arn:aws:iam::840541460064:policy/myPolicy-to… │      │
│                        │                                                              │      │
└────────────────────────┴──────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                         │
├────────────────────┬────────────────────────────────────────────────────────────────────────┤
│ IamRole            │ role-allow-assume-role                                                 │
└────────────────────┴────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t IamRole" executed in 3s
```

### AWS CLI

List all iam roles

```
aws iam list-roles
```

Delete a role

```
aws iam delete-role --role-name role-name
```

List a role:

```
aws iam get-role --role-name my-role
```
