---
title: KeyPair
---

Provide a reference to an SSH key pair, used to connect to EC2 instances.

See the [AWS documentation for ec2 key pair](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-key-pairs.html) to create a new one.

```js
const keyPair = provider.EC2.useKeyPair({
  name: "kp",
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/keyPair/iac.js#L10)

### Used By

- [EC2](./EC2.md)

### Aws cli

List the available key pairs:

```bash
aws ec2 describe-key-pairs
```
