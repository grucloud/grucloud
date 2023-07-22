---
id: EgressOnlyInternetGateway
title: Egress Only Internet Gateway
---

Provides an [Internet Gateway](https://console.aws.amazon.com/vpc/home?#EgressOnlyInternetGateways:)

```js
exports.createResources = () => [
  {
    type: "EgressOnlyInternetGateway",
    group: "EC2",
    name: "my-eigw",
    dependencies: ({}) => ({
      vpc: "eoigw-vpc",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/egress-only-internet-gateway)
- [aws-samples/aws-network-hub-for-terraform](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/aws-network-hub-for-terraform)

### Properties

- [CreateEgressOnlyInternetGatewayCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/modules/createegressonlyinternetgatewayrequest.html)

### Dependencies

- [Vpc](./Vpc.md)

## Listing

List only the egress internet gateway with the _EgressOnlyInternetGateway_ filter:

```sh
gc l -t EgressOnlyInternetGateway
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::EgressOnlyInternetGateway from aws                              │
├────────────────────────────────────────────────────────────────────────┤
│ name: my-eigw                                                          │
│ managedByUs: Yes                                                       │
│ live:                                                                  │
│   Attachments:                                                         │
│     - State: attached                                                  │
│       VpcId: vpc-0a59a82528585ac3a                                     │
│   EgressOnlyInternetGatewayId: eigw-0716031adb54c7170                  │
│   Tags:                                                                │
│     - Key: gc-created-by-provider                                      │
│       Value: aws                                                       │
│     - Key: gc-managed-by                                               │
│       Value: grucloud                                                  │
│     - Key: gc-project-name                                             │
│       Value: egress-only-internet-gateway                              │
│     - Key: gc-stage                                                    │
│       Value: dev                                                       │
│     - Key: Name                                                        │
│       Value: my-eigw                                                   │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────┐
│ aws                                                                   │
├────────────────────────────────┬──────────────────────────────────────┤
│ EC2::EgressOnlyInternetGateway │ my-eigw                              │
└────────────────────────────────┴──────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EgressOnlyInternetGateway" executed in 7s, 173 MB
```
