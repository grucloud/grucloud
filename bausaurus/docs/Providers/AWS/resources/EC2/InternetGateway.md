---
id: InternetGateway
title: Internet Gateway
---

Provides an [Internet Gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html)

```js
exports.createResources = () => [
  {
    type: "Vpc",
    group: "EC2",
    name: "vpc",
    properties: ({}) => ({
      CidrBlock: "192.168.0.0/16",
    }),
  },
  {
    type: "InternetGateway",
    group: "EC2",
    name: "internet-gateway",
    dependencies: () => ({
      vpc: "vpc",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/Instance/ec2-vpc)

### Properties

- [CreateInternetGatewayCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createinternetgatewaycommandinput.html)

### Dependencies

- [Vpc](./Vpc.md)

## Listing

List only the internet gateway with the _InternetGateway_ filter:

```sh
gc l -t InternetGateway
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────────────┐
│ 2 EC2::InternetGateway from aws                                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: default                                                                      │
│ managedByUs: NO                                                                    │
│ live:                                                                              │
│   Attachments:                                                                     │
│     - State: available                                                             │
│       VpcId: vpc-faff3987                                                          │
│   InternetGatewayId: igw-0b24ea870a58035dc                                         │
│   OwnerId: 840541460064                                                            │
│   Tags:                                                                            │
│     - Key: Name                                                                    │
│       Value: default                                                               │
│                                                                                    │
├────────────────────────────────────────────────────────────────────────────────────┤
│ name: inspection-vpc                                                               │
│ managedByUs: Yes                                                                   │
│ live:                                                                              │
│   Attachments:                                                                     │
│     - State: available                                                             │
│       VpcId: vpc-021c0573712bc7d11                                                 │
│   InternetGatewayId: igw-060ff7dec3ace6893                                         │
│   OwnerId: 840541460064                                                            │
│   Tags:                                                                            │
│     - Key: Environment                                                             │
│       Value: development                                                           │
│     - Key: Name                                                                    │
│       Value: inspection-vpc                                                        │
│     - Key: Owner                                                                   │
│       Value: user                                                                  │
│     - Key: Provisioner                                                             │
│       Value: terraform                                                             │
│                                                                                    │
└────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├──────────────────────┬────────────────────────────────────────────────────────────┤
│ EC2::InternetGateway │ default                                                    │
│                      │ inspection-vpc                                             │
└──────────────────────┴────────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t EC2::InternetGateway" executed in 5s, 171 MB
```
