---
id: TransitGatewayRouteTable
title: Transit Gateway Route Table
---

Provides a [Transit Gateway Route Table](https://console.aws.amazon.com/vpc/home?#TransitGatewayRouteTables:)

```js
exports.createResources = () => [
  {
    type: "TransitGatewayRouteTable",
    group: "EC2",
    name: "tgw-rtb-transit-gateway-default",
    readOnly: true,
    properties: ({}) => ({
      DefaultAssociationRouteTable: true,
      DefaultPropagationRouteTable: true,
    }),
    dependencies: () => ({
      transitGateway: "transit-gateway",
    }),
  },
];
```

### Examples

- [transit gateway](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/TransitGateway/transit-gateway)
- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-inspection-vpc)

### Properties

- [CreateTransitGatewayRouteTableCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createtransitgatewayroutetablecommandinput.html)

### Dependencies

- [TransitGateway](./TransitGateway.md)

### Used By

- [TransitGatewayRouteTableAssociation](./TransitGatewayRouteTableAssociation.md)

### List

```sh
gc l -t EC2::TransitGatewayRouteTable
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────┐
│ 2 EC2::TransitGatewayRouteTable from aws                                   │
├────────────────────────────────────────────────────────────────────────────┤
│ name: Inspection_VPC_Route_Table                                           │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   TransitGatewayRouteTableId: tgw-rtb-0b8c3178242478505                    │
│   TransitGatewayId: tgw-0253874e089f68280                                  │
│   State: available                                                         │
│   DefaultAssociationRouteTable: false                                      │
│   DefaultPropagationRouteTable: false                                      │
│   CreationTime: 2022-05-02T13:42:42.000Z                                   │
│   Tags:                                                                    │
│     - Key: gc-created-by-provider                                          │
│       Value: aws                                                           │
│     - Key: gc-managed-by                                                   │
│       Value: grucloud                                                      │
│     - Key: gc-project-name                                                 │
│       Value: hub-and-spoke-with-inspection-vpc                             │
│     - Key: gc-stage                                                        │
│       Value: dev                                                           │
│     - Key: Name                                                            │
│       Value: Inspection_VPC_Route_Table                                    │
│                                                                            │
├────────────────────────────────────────────────────────────────────────────┤
│ name: Spoke_VPC_Route_Table                                                │
│ managedByUs: Yes                                                           │
│ live:                                                                      │
│   TransitGatewayRouteTableId: tgw-rtb-00c4b3773b8d82089                    │
│   TransitGatewayId: tgw-0253874e089f68280                                  │
│   State: available                                                         │
│   DefaultAssociationRouteTable: false                                      │
│   DefaultPropagationRouteTable: false                                      │
│   CreationTime: 2022-05-02T13:42:42.000Z                                   │
│   Tags:                                                                    │
│     - Key: gc-created-by-provider                                          │
│       Value: aws                                                           │
│     - Key: gc-managed-by                                                   │
│       Value: grucloud                                                      │
│     - Key: gc-project-name                                                 │
│       Value: hub-and-spoke-with-inspection-vpc                             │
│     - Key: gc-stage                                                        │
│       Value: dev                                                           │
│     - Key: Name                                                            │
│       Value: Spoke_VPC_Route_Table                                         │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────┐
│ aws                                                                       │
├───────────────────────────────┬───────────────────────────────────────────┤
│ EC2::TransitGatewayRouteTable │ Inspection_VPC_Route_Table                │
│                               │ Spoke_VPC_Route_Table                     │
└───────────────────────────────┴───────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t EC2::TransitGatewayRouteTable" executed in 4s, 165 MB
```
