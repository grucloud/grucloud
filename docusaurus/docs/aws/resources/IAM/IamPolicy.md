---
id: IamPolicy
title: Iam Policy
---

Provides an Iam Policy.

The examples below create or reference a policy, and add it to a role, a user or a group.

### Attach a policy to a role

Let's create a policy and a user, the policy is attached to the user via the _dependencies_ field:

```js
const iamPolicy = provider.IAM.makePolicy({
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

const iamRole = provider.IAM.makeRole({
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

### Attach a read only policy to a role

A policy can be referenced by its _Arn_, invoke _usePolicy_ instead of _makePolicy_:

```js
const iamPolicyEKSCluster = provider.IAM.usePolicy({
  name: "AmazonEKSClusterPolicy",
  properties: () => ({
    Arn: "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy",
  }),
});

const iamRole = provider.IAM.makeRole({
  name: "my-role",
  dependencies: { policies: [iamPolicyEKSCluster] },

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

### Attach a policy to a user

Let's create a policy and attach it to the user:

```js
const iamPolicy = provider.IAM.makePolicy({
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

const iamUser = provider.IAM.makeUser({
  name: "Alice",
  dependencies: { policies: [iamPolicy] },
  properties: () => ({}),
});
```

### Attach a policy to a group

Let's create a policy and attach it to the group:

```js
const iamPolicy = provider.IAM.makePolicy({
  name: "policy-ec2-describe",
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
  }),
});

const iamGroup = provider.IAM.makeGroup({
  name: "Admin",
  dependencies: { policies: [iamPolicy] },
  properties: () => ({}),
});
```

### Examples

- [Policies attached to a role](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iam-policy/iac.js)
- [Policies attached to roles, users and groups](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createPolicy-property)

### Used By

- [IamRole](./IamRole)
- [IamUser](./IamUser)
- [IamGroup](./IamGroup)

### List

```sh
gc l -t IamPolicy
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2 IamPolicy from aws                                                                          │
├───────────────────────────┬────────────────────────────────────────────────────────────┬──────┤
│ Name                      │ Data                                                       │ Our  │
├───────────────────────────┼────────────────────────────────────────────────────────────┼──────┤
│ policy-allow-ec2          │ PolicyName: policy-allow-ec2                               │ Yes  │
│                           │ PolicyId: ANPA4HNBM2ZQAVBUWM5OH                            │      │
│                           │ Arn: arn:aws:iam::840541460064:policy/policy-allow-ec2     │      │
│                           │ Path: /                                                    │      │
│                           │ DefaultVersionId: v1                                       │      │
│                           │ AttachmentCount: 1                                         │      │
│                           │ PermissionsBoundaryUsageCount: 0                           │      │
│                           │ IsAttachable: true                                         │      │
│                           │ Description: Allow ec2:Describe                            │      │
│                           │ CreateDate: 2021-04-19T23:43:49.000Z                       │      │
│                           │ UpdateDate: 2021-04-19T23:43:49.000Z                       │      │
│                           │ Tags:                                                      │      │
│                           │   - Key: ManagedBy                                         │      │
│                           │     Value: GruCloud                                        │      │
│                           │   - Key: stage                                             │      │
│                           │     Value: dev                                             │      │
│                           │   - Key: projectName                                       │      │
│                           │     Value: @grucloud/example-aws-iam-policy                │      │
│                           │   - Key: CreatedByProvider                                 │      │
│                           │     Value: aws                                             │      │
│                           │   - Key: Name                                              │      │
│                           │     Value: policy-allow-ec2                                │      │
│                           │ EntitiesForPolicy:                                         │      │
│                           │   PolicyGroups: []                                         │      │
│                           │   PolicyUsers: []                                          │      │
│                           │   PolicyRoles:                                             │      │
│                           │     - RoleName: role-4-policies                            │      │
│                           │       RoleId: AROA4HNBM2ZQEPTRMF2XD                        │      │
│                           │                                                            │      │
├───────────────────────────┼────────────────────────────────────────────────────────────┼──────┤
│ AmazonEKSWorkerNodePolicy │ name: AmazonEKSWorkerNodePolicy                            │ NO   │
│                           │ Arn: arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy     │      │
│                           │                                                            │      │
└───────────────────────────┴────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                          │
├────────────────────┬─────────────────────────────────────────────────────────────────────────┤
│ IamPolicy          │ policy-allow-ec2                                                        │
│                    │ AmazonEKSWorkerNodePolicy                                               │
└────────────────────┴─────────────────────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t IamPolicy" executed in 2s
```
