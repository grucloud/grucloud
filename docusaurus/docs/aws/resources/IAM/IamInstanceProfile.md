---
id: IamInstanceProfile
title: Iam Instance Profile
---

Provides an Iam Instance Profile.

The following example create an instance profile, a role attached to this instance profile, and create an ec2 instance under this profile:

```js
const iamRole = await provider.makeIamRole({
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

const iamInstanceProfile = await provider.makeIamInstanceProfile({
  name: "my-instance-profile",
  dependencies: { iamRoles: [iamRoles] },
  properties: () => ({
    Path: "/",
  }),
});

const server = await provider.makeEC2({
  name: "web-iam",
  dependencies: { keyPair, iamInstanceProfile },
  properties: () => ({
    InstanceType: "t2.micro",
    ImageId: "ami-00f6a0c18edb19300", // Ubuntu 18.04
  }),
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createInstanceProfile-property)

### Dependencies

- [IamRole](./IamRole)

### Used By

- [EC2](../EC2/EC2)

### AWS CLI

List all iam instances profile

```
aws iam list-instance-profiles

```

Delete an instance profile

```
aws iam delete-instance-profile --instance-profile-name ExampleInstanceProfile
```
