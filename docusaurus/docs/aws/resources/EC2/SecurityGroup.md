---
title: SecurityGroup
---

Create a security group, used to restrict network access to the EC2 instances.

```js
const sg = await provider.makeSecurityGroup({
  name: "securityGroup",
  dependencies: { vpc },
  properties: () => ({
    create: {
      Description: "Security Group SSH",
    },
    ingress: {
      IpPermissions: [
        {
          FromPort: 22,
          IpProtocol: "tcp",
          IpRanges: [
            {
              CidrIp: "0.0.0.0/0",
            },
          ],
          Ipv6Ranges: [
            {
              CidrIpv6: "::/0",
            },
          ],
          ToPort: 22,
        },
      ],
    },
  }),
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2-vpc/iac.js#L26)

### Properties

- https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#authorizeSecurityGroupIngress-property

### Dependencies

- [Vpc](./Vpc)

### Used By

- [EC2](./EC2)
