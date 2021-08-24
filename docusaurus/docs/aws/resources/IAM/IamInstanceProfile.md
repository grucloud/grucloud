---
id: IamInstanceProfile
title: Iam Instance Profile
---

Provides an Iam Instance Profile.

The following example create an instance profile, a role attached to this instance profile, and create an ec2 instance under this profile:

```js
const role = provider.iam.makeRole({
  name: "my-role",
  properties: () => ({
    Path: "/",
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
  dependencies: { roles: [role] },
  properties: () => ({
    Path: "/",
  }),
});

const image = provider.ec2.useImage({
  name: "Amazon Linux 2",
  properties: () => ({
    Filters: [
      {
        Name: "architecture",
        Values: ["x86_64"],
      },
      {
        Name: "description",
        Values: ["Amazon Linux 2 AMI *"],
      },
    ],
  }),
});

const server = provider.ec2.makeInstance({
  name: "web-iam",
  dependencies: { image, keyPair, iamInstanceProfile },
  properties: () => ({
    InstanceType: "t2.micro",
  }),
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createInstanceProfile-property)

### Dependencies

- [IamRole](./IamRole)

### Used By

- [EC2](../EC2/EC2)

### List

```sh
gc l -t IamInstanceProfile
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 3/3
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 IamInstanceProfile from aws                                                           │
├──────────────────────────────────────────┬───────────────────────────────────────┬──────┤
│ Name                                     │ Data                                  │ Our  │
├──────────────────────────────────────────┼───────────────────────────────────────┼──────┤
│ eks-54bc6e8b-43c7-2c95-7057-1af0e6e8aa77 │ Path: /                               │ NO   │
│                                          │ InstanceProfileName: eks-54bc6e8b-43… │      │
│                                          │ InstanceProfileId: AIPA4HNBM2ZQCIF3D… │      │
│                                          │ Arn: arn:aws:iam::840541460064:insta… │      │
│                                          │ CreateDate: 2021-04-16T23:49:13.000Z  │      │
│                                          │ Roles:                                │      │
│                                          │   - Path: /                           │      │
│                                          │     RoleName: role-node-group         │      │
│                                          │     RoleId: AROA4HNBM2ZQICLVXAZIM     │      │
│                                          │     Arn: arn:aws:iam::840541460064:r… │      │
│                                          │     CreateDate: 2021-04-16T23:39:55.… │      │
│                                          │     AssumeRolePolicyDocument: %7B%22… │      │
│                                          │     Tags:                             │      │
│                                          │       - Key: Name                     │      │
│                                          │         Value: role-node-group        │      │
│                                          │       - Key: ManagedBy                │      │
│                                          │         Value: GruCloud               │      │
│                                          │       - Key: CreatedByProvider        │      │
│                                          │         Value: aws                    │      │
│                                          │       - Key: stage                    │      │
│                                          │         Value: dev                    │      │
│                                          │       - Key: projectName              │      │
│                                          │         Value: ex-eks-mod             │      │
│                                          │ Tags: []                              │      │
│                                          │                                       │      │
└──────────────────────────────────────────┴───────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                    │
├────────────────────┬───────────────────────────────────────────────────────────────────┤
│ IamInstanceProfile │ eks-54bc6e8b-43c7-2c95-7057-1af0e6e8aa77                          │
└────────────────────┴───────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t IamInstanceProfile" executed in 3s
```

### AWS CLI

List all iam instances profile

```
aws iam list-instance-profiles

```

Delete an instance profile

```
aws iam delete-instance-profile --instance-profile-name ExampleInstanceProfile
```
