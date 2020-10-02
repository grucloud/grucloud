---
id: IamPolicy
title: Iam Policy
---

Provides an Iam Policy.

The examples below create a policy and add it to a role, a user or a group.

### Attach a policy to a role

```js
const iamRole = await provider.makeIamRole({
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

const iamPolicy = await provider.makeIamPolicy({
  name: "my-policy",
  dependencies: { iamRole },
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
```

### Attach a policy to a user

```js
const iamUser = await provider.makeIamUser({
  name: "Alice",
  properties: () => ({}),
});

const iamPolicy = await provider.makeIamPolicy({
  name: "my-policy",
  dependencies: { iamUser },
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
```

### Attach a policy to a group

```js
const iamGroup = await provider.makeIamGroup({
  name: "Admin",
  properties: () => ({}),
});

const iamPolicy = await provider.makeIamPolicy({
  name: "policy-ec2-describe",
  dependencies: { iamGroup },
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
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/master/examples/aws/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createPolicy-property)

### Dependencies

- [IamRole](./IamRole)
- [IamUser](./IamUser)
- [IamGroup](./IamGroup)

### AWS CLI

List all iam policies

```
aws iam list-policies --scope Local
```

Delete a policy:

```
aws iam delete-policy --policy-arn arn:aws:iam::840541460064:role/role-example

```

Detach a policy:

```
aws iam detach-user-policy --user-name alice --policy-arn arn:aws:iam::840541460064:policy/policy-example-3
```
