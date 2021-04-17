---
id: EC2
title: EC2 Instance
---

Provides an EC2 instance resource, a.k.a virtual machine.

```js
const server = await provider.makeEC2({
  name: "myserver",
  properties: () => ({
    InstanceType: "t2.micro",
    ImageId: "ami-0917237b4e71c5759", // Ubuntu 20.04
  }),
  dependencies: {
    keyPair,
    subnet,
    securityGroups: [sg],
    iamInstanceProfile,
    volumes: [volume],
  },
});
```

### Examples

- [one ec2](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-simple/iac.js)
- [ec2 with elastic ip address, key pair](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/iac.js)
- [attached an EBS volume](https://github.com/grucloud/grucloud/blob/main/examples/aws/volume/iac.js)
- [example with IAM](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iac.js)
- [full example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-vpc/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#runInstances-property)

### Dependencies

- [SecurityGroup](./SecurityGroup)
- [Subnet](./Subnet)
- [KeyPair](./KeyPair)
- [ElasticIpAddress](./ElasticIpAddress)
- [Volume](./Volume)
- [Image](./Image)
- [IamInstanceProfile](../IAM/iamInstanceProfile)
