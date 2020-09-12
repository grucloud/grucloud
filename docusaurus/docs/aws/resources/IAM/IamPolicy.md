---
id: IamPolicy
title: Iam Policy
---

Provides an Iam Policy

```js
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
aws iam list-policies
```

Delete a policy:

```
aws iam delete-policy --policy-arn arn:aws:iam::840541460064:role/role-example

```
