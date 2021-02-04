---
id: IamPolicy
title: Iam Policy
---

Provides an Iam Policy.

The examples below create a policy and add it to a role, a user or a group.

### Attach a policy to a role

```js
const iamPolicy = await provider.makeIamPolicy({
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

const iamRole = await provider.makeIamRole({
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

### Attach a policy to a user

```js
const iamPolicy = await provider.makeIamPolicy({
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

const iamUser = await provider.makeIamUser({
  name: "Alice",
  dependencies: { policies: [iamPolicy] },
  properties: () => ({}),
});
```

### Attach a policy to a group

```js
const iamPolicy = await provider.makeIamPolicy({
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

const iamGroup = await provider.makeIamGroup({
  name: "Admin",
  dependencies: { policies: [iamPolicy] },
  properties: () => ({}),
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createPolicy-property)

### Used By

- [IamRole](./IamRole)
- [IamUser](./IamUser)
- [IamGroup](./IamGroup)
