---
id: IamInstanceProfile
title: Iam Instance Profile
---

Provides an Iam Instance Profile.

The following examples create an instance profile and a role attached to it:

```js
const iamRole = await provider.makeIamRole({
  name: "my-role",
  properties: () => ({
    Path: "/",
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

const iamInstanceProfile = await provider.makeIamInstanceProfile({
  name: "my-instance-profile",
  dependencies: { iamRole },
  properties: () => ({
    Path: "/",
  }),
});
```

### Examples

- [simple example](https://github.com/FredericHeem/grucloud/blob/master/examples/aws/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createInstanceProfile-property)

### AWS CLI

List all iam instances profile

```
aws iam list-instance-profiles

```

Delete an instance profile

```
aws iam delete-instance-profile --instance-profile-name ExampleInstanceProfile
```
