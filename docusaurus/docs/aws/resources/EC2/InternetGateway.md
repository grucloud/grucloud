---
id: InternetGateway
title: Internet Gateway
---

Provides an [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)

```js
const vpc = provider.EC2.makeVpc({
  name: "vpc",
  properties: () => ({
    CidrBlock: "10.1.0.0/16",
  }),
});

const ig = provider.EC2.makeInternetGateway({
  name: "ig",
  dependencies: { vpc },
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/ec2/ec2-vpc/iac.js)

### Dependencies

- [Vpc](./Vpc)

## Listing

List only the internet gateway with the _InternetGateway_ filter:

```sh
gc l -t InternetGateway
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ 2 InternetGateway from aws                                                            │
├───────────────────────┬────────────────────────────────────────────────────────┬──────┤
│ Name                  │ Data                                                   │ Our  │
├───────────────────────┼────────────────────────────────────────────────────────┼──────┤
│ igw-041e0d42bb3b4149c │ Attachments:                                           │ NO   │
│                       │   - State: available                                   │      │
│                       │     VpcId: vpc-bbbafcd3                                │      │
│                       │ InternetGatewayId: igw-041e0d42bb3b4149c               │      │
│                       │ OwnerId: 840541460064                                  │      │
│                       │ Tags: []                                               │      │
│                       │                                                        │      │
├───────────────────────┼────────────────────────────────────────────────────────┼──────┤
│ igw-0d51a4e8ebf39dd88 │ Attachments: []                                        │ NO   │
│                       │ InternetGatewayId: igw-0d51a4e8ebf39dd88               │      │
│                       │ OwnerId: 840541460064                                  │      │
│                       │ Tags: []                                               │      │
│                       │                                                        │      │
└───────────────────────┴────────────────────────────────────────────────────────┴──────┘


dot file written to: list.dot
output saved to: list.svg
List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                  │
├────────────────────┬─────────────────────────────────────────────────────────────────┤
│ InternetGateway    │ igw-041e0d42bb3b4149c                                           │
│                    │ igw-0d51a4e8ebf39dd88                                           │
└────────────────────┴─────────────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t InternetGateway" executed in 4s
```

### AWS CLI

List the internet Gateways

```
aws ec2 describe-internet-gateways
```
