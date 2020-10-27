---
id: IamGroup
title: Iam Group
---

Provides an Iam Group.

This example creates a group called Admin, creates a user and add it to the group, create a policy and attach it to the group.

```js
const iamGroup = await provider.makeIamGroup({
  name: "Admin",
  properties: () => ({}),
});

const iamUser = await provider.makeIamUser({
  name: "Alice",
  dependencies: { iamGroups: [iamGroup] },
  properties: () => ({}),
});

const iamPolicyToGroup = await provider.makeIamPolicy({
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

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createGroup-property)

### Dependencies

### Used By

- [IamPolicy](./IamPolicy)
- [IamUser](./IamUser)

### AWS CLI

List all iam groups

```
aws iam list-groups
```

Delete a group:

```
aws iam delete-group --group-name Admin
```
