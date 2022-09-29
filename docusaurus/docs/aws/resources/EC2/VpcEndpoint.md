---
id: VpcEndpoint
title: Vpc Endpoint
---

Provides a [Vpc Endpoint](https://console.aws.amazon.com/vpc/home?#Endpoints:)

### Sample

#### Gateway Endpoint

```js
exports.createResources = () => [
 {
    type: "VpcEndpoint",
    group: "EC2",
    name: "project-vpc-endpoint-vpce-s3",
    properties: ({config}) => ({
      ServiceName: `com.amazonaws.${config.region}.s3`,
      PolicyDocument: {
        Version: "2008-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: "*",
            Resource: "*",
          },
        ],
      },
      PrivateDnsEnabled: false,
      RequesterManaged: false,
      VpcEndpointType: "Gateway",
    }),
    dependencies: () => ({
      vpc: "project-vpc-endpoint-vpc",
    }),
];
```

#### Interface Endpoint

```js
exports.createResources = () => [
  {
    type: "VpcEndpoint",
    group: "EC2",
    properties: ({}) => ({
      PolicyDocument: {
        Statement: [
          {
            Action: "*",
            Effect: "Allow",
            Principal: "*",
            Resource: `*`,
          },
        ],
      },
      PrivateDnsEnabled: true,
      RequesterManaged: false,
      VpcEndpointType: "Interface",
      ServiceName: `com.amazonaws.${config.region}.ec2`,
    }),
    dependencies: () => ({
      vpc: "spoke-vpc-2",
      subnets: [
        "spoke-vpc-2-private-subnet-a",
        "spoke-vpc-2-private-subnet-b",
        "spoke-vpc-2-private-subnet-c",
      ],
    }),
  },
];
```

### Examples

- [vpc endpoint simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/vpc-endpoint)
- [vpc peering](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/vpc-peering)
- [hub-and-spoke-with-inspection-vpc](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-inspection-vpc)
- [aws-network-hub-for-terraform](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/aws-network-hub-for-terraform)
- [hub-and-spoke-with-shared-services-vpc-terraform](https://github.com/grucloud/grucloud/blob/main/examples/aws/aws-samples/hub-and-spoke-with-shared-services-vpc-terraform)
- [record-vpc-endpoint](https://github.com/grucloud/grucloud/blob/main/examples/aws/Route53/record-vpc-endpoint)
- [serverless-patterns/cdk-vpc-lambda-sfn](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/cdk-vpc-lambda-sfn)
- [serverless-patterns/fargate-eventbridge](https://github.com/grucloud/grucloud/blob/main/examples/aws/serverless-patterns/fargate-eventbridge)
- [vpn-aws-azure](https://github.com/grucloud/grucloud/blob/main/examples/cross-cloud/vpn-aws-azure)
- [vpn-aws-gcp](https://github.com/grucloud/grucloud/blob/main/examples/cross-cloud/vpn-aws-gcp)

  ### Properties

- [CreateVpcEndpointCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createvpcendpointcommandinput.html)

### Dependencies

- [EC2 Vpc](./Vpc.md)
- [EC2 Subnet](./Subnet.md)
- [IAM Role](../IAM/Role.md)

### Used By

- [EC2 Route](./Route.md)
- [Route53 Record](../Route53/Record.md)

### List

```sh
gc l -t VpcEndpoint
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌──────────────────────────────────────────────────────────────────────┐
│ 1 EC2::VpcEndpoint from aws                                          │
├──────────────────────────────────────────────────────────────────────┤
│ name: project-vpc::project-vpc-endpoint-vpce-s3                      │
│ managedByUs: Yes                                                     │
│ live:                                                                │
│   VpcEndpointId: vpce-04c28f6091f2009c1                              │
│   VpcEndpointType: Gateway                                           │
│   VpcId: vpc-09b4e35939bf3408b                                       │
│   ServiceName: com.amazonaws.us-east-1.s3                            │
│   State: available                                                   │
│   PolicyDocument:                                                    │
│     Version: 2008-10-17                                              │
│     Statement:                                                       │
│       - Effect: Allow                                                │
│         Principal: *                                                 │
│         Action: *                                                    │
│         Resource: *                                                  │
│   RouteTableIds:                                                     │
│     - "rtb-010e7a82091a50e0d"                                        │
│   SubnetIds: []                                                      │
│   Groups: []                                                         │
│   PrivateDnsEnabled: false                                           │
│   RequesterManaged: false                                            │
│   NetworkInterfaceIds: []                                            │
│   DnsEntries: []                                                     │
│   CreationTimestamp: 2022-03-11T21:08:56.000Z                        │
│   Tags:                                                              │
│     - Key: gc-created-by-provider                                    │
│       Value: aws                                                     │
│     - Key: gc-managed-by                                             │
│       Value: grucloud                                                │
│     - Key: gc-project-name                                           │
│       Value: @grucloud/example-aws-ec2-vpb-endpoint                  │
│     - Key: gc-stage                                                  │
│       Value: dev                                                     │
│     - Key: Name                                                      │
│       Value: project-vpc-endpoint-vpce-s3                            │
│   OwnerId: 840541460064                                              │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────┐
│ aws                                                                 │
├──────────────────┬──────────────────────────────────────────────────┤
│ EC2::VpcEndpoint │ project-vpc::project-vpc-endpoint-vpce-s3        │
└──────────────────┴──────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list -t VpcEndpoint" executed in 3s, 198 MB
```
