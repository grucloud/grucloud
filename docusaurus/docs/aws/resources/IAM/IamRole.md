---
id: IamRole
title: Iam Role
---

Provides an Iam Role.

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
```

### Add a policy to a role

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

### Add a role to an instance profile

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

const iamInstanceProfile = await provider.makeIamInstanceProfile({
  name: "my-instance-profile",
  dependencies: { iamRoles: [iamRole] },
  properties: () => ({}),
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/master/examples/aws/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property)

### Dependencies

- [IamInstanceProfile](./IamInstanceProfile)

### Used By

- [IamPolicy](./IamPolicy)

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
