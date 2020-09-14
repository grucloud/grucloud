---
id: IamRole
title: Iam Role
---

Provides an Iam Role.

```js
const iamRole = await provider.makeIamRole({
  name: "my-role",
  properties: () => ({
    AssumeRolePolicyDocument: JSON.stringify({
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
    }),
  }),
});
```

### Examples

- [simple example](https://github.com/FredericHeem/grucloud/blob/master/examples/aws/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property)

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
