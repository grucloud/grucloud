---
id: IamPolicy
title: Iam Policy
---

Provides an Iam Policy.

The example below create an IAM user and a Policy attached to this user.

```js
const iamUser = await provider.makeIamUser({
  name: "Alice",
  properties: () => ({}),
});

const iamPolicy = await provider.makeIamPolicy({
  name: "my-policy",
  dependencies: { iamUser },

  properties: () => ({
    PolicyName: iamPolicyName,
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

### Examples

- [simple example](https://github.com/FredericHeem/grucloud/blob/master/examples/aws/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createPolicy-property)

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
