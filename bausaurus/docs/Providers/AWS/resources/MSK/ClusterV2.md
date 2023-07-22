---
id: ClusterV2
title: ClusterV2
---

Manages a [MSK Cluster V2](https://console.aws.amazon.com/msk/home#/home).

## Sample code

```js
exports.createResources = () => [
  {
    type: "ClusterV2",
    group: "MSK",
    properties: ({ getId }) => ({
      ClusterName: "demo-cluster-1",
      ClusterType: "SERVERLESS",
      Serverless: {
        ClientAuthentication: {
          Sasl: {
            Iam: {
              Enabled: true,
            },
          },
        },
        VpcConfigs: [
          {
            SecurityGroupIds: [
              `${getId({
                type: "SecurityGroup",
                group: "EC2",
                name: "sg::vpc-default::default",
              })}`,
            ],
            SubnetIds: [
              `${getId({
                type: "Subnet",
                group: "EC2",
                name: "vpc-default::subnet-default-a",
              })}`,
              `${getId({
                type: "Subnet",
                group: "EC2",
                name: "vpc-default::subnet-default-d",
              })}`,
              `${getId({
                type: "Subnet",
                group: "EC2",
                name: "vpc-default::subnet-default-f",
              })}`,
            ],
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      subnets: [
        "vpc-default::subnet-default-a",
        "vpc-default::subnet-default-d",
        "vpc-default::subnet-default-f",
      ],
      securityGroups: ["sg::vpc-default::default"],
    }),
  },
];
```

## Properties

- [CreateClusterV2CommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-kafka/interfaces/createclusterv2commandinput.html)

## Dependencies

- [EC2 Security Group](../EC2/SecurityGroup.md)
- [EC2 Subnet](../EC2/Subnet.md)
- [Firehose Delivery Stream](../Firehose/DeliveryStream.md)
- [KMS Key](../KMS/Key.md)
- [MSK Configuration](./Configuration.md)
- [S3 Bucket](../S3/Bucket.md)

## Used By

## Full Examples

- [msk v2 simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/MSK/msk-serverless-simple)

## List

```sh
gc l -t MSK::ClusterV2
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 MSK::ClusterV2 from aws                                                 │
├───────────────────────────────────────────────────────────────────────────┤
│ name: demo-cluster-1                                                      │
│ managedByUs: Yes                                                          │
│ live:                                                                     │
│   ClusterArn: arn:aws:kafka:us-east-1:840541460064:cluster/demo-cluster-… │
│   ClusterName: demo-cluster-1                                             │
│   ClusterType: SERVERLESS                                                 │
│   CreationTime: 2022-10-16T16:50:48.007Z                                  │
│   CurrentVersion: K2EUQ1WTGCTBG2                                          │
│   Serverless:                                                             │
│     ClientAuthentication:                                                 │
│       Sasl:                                                               │
│         Iam:                                                              │
│           Enabled: true                                                   │
│     VpcConfigs:                                                           │
│       - SecurityGroupIds:                                                 │
│           - "sg-4e82a670"                                                 │
│         SubnetIds:                                                        │
│           - "subnet-b80a4ff5"                                             │
│           - "subnet-41e85860"                                             │
│           - "subnet-50cca05e"                                             │
│   State: ACTIVE                                                           │
│   Tags:                                                                   │
│     gc-managed-by: grucloud                                               │
│     gc-project-name: msk-serverless                                       │
│     gc-stage: dev                                                         │
│     gc-created-by-provider: aws                                           │
│     Name: demo-cluster-1                                                  │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├────────────────┬─────────────────────────────────────────────────────────┤
│ MSK::ClusterV2 │ demo-cluster-1                                          │
└────────────────┴─────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t MSK::ClusterV2" executed in 4s, 100 MB
```
