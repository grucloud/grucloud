---
id: ManagedPrefixList
title: Managed Prefix List
---

Provides a [Managed Prefix List](https://console.aws.amazon.com/vpc/home?#ManagedPrefixLists:)

## Code

```js
exports.createResources = () => [
  {
    type: "ManagedPrefixList",
    group: "EC2",
    properties: ({}) => ({
      PrefixListName: "my-prefix",
      AddressFamily: "IPv4",
      MaxEntries: 5,
      Entries: [
        {
          Cidr: "10.0.0.0/24",
        },
        {
          Cidr: "10.0.1.0/24",
        },
      ],
    }),
  },
];
```

## Examples

- [Managed Prefix List simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/prefix-list)

## Properties

- [CreateManagedPrefixListCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createmanagedprefixlistcommandinput.html)

## Dependencies

## Used By

- [EC2 Route](../EC2/Route.md)
- [EC2 SecurityGroupRuleIngress](../EC2/SecurityGroupRuleIngress.md)
- [EC2 SecurityGroupRuleEgress](../EC2/SecurityGroupRuleEgress.md)

## List

```sh
gc l -t ManagedPrefixList
```

```sh
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 5 EC2::ManagedPrefixList from aws                                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ name: com.amazonaws.global.cloudfront.origin-facing                                 │
│ managedByUs: NO                                                                     │
│ live:                                                                               │
│   PrefixListId: pl-3b927c52                                                         │
│   AddressFamily: IPv4                                                               │
│   State: create-complete                                                            │
│   PrefixListArn: arn:aws:ec2:us-east-1:aws:prefix-list/pl-3b927c52                  │
│   PrefixListName: com.amazonaws.global.cloudfront.origin-facing                     │
│   Tags:                                                                             │
│     - Key: gc-created-by-provider                                                   │
│       Value: aws                                                                    │
│     - Key: gc-managed-by                                                            │
│       Value: grucloud                                                               │
│     - Key: gc-project-name                                                          │
│       Value: subnet                                                                 │
│     - Key: gc-stage                                                                 │
│       Value: dev                                                                    │
│     - Key: Name                                                                     │
│       Value: com.amazonaws.global.cloudfront.origin-facing                          │
│   OwnerId: AWS                                                                      │
│   Entries:                                                                          │
│     - Cidr: 13.124.199.0/24                                                         │
│     - Cidr: 130.176.0.0/18                                                          │
│     - Cidr: 130.176.128.0/21                                                        │
│     - Cidr: 130.176.136.0/23                                                        │
│     - Cidr: 130.176.140.0/22                                                        │
│     - Cidr: 130.176.144.0/20                                                        │
│     - Cidr: 130.176.160.0/19                                                        │
│     - Cidr: 130.176.192.0/19                                                        │
│     - Cidr: 130.176.64.0/21                                                         │
│     - Cidr: 130.176.72.0/22                                                         │
│     - Cidr: 130.176.76.0/24                                                         │
│     - Cidr: 130.176.78.0/23                                                         │
│     - Cidr: 130.176.80.0/22                                                         │
│     - Cidr: 130.176.86.0/23                                                         │
│     - Cidr: 130.176.88.0/21                                                         │
│     - Cidr: 130.176.96.0/19                                                         │
│     - Cidr: 15.158.0.0/16                                                           │
│     - Cidr: 204.246.166.0/24                                                        │
│     - Cidr: 205.251.218.0/24                                                        │
│     - Cidr: 52.46.0.0/22                                                            │
│     - Cidr: 52.46.16.0/20                                                           │
│     - Cidr: 52.46.32.0/19                                                           │
│     - Cidr: 52.46.4.0/23                                                            │
│     - Cidr: 52.82.128.0/23                                                          │
│     - Cidr: 52.82.134.0/23                                                          │
│     - Cidr: 54.182.128.0/20                                                         │
│     - Cidr: 54.182.144.0/21                                                         │
│     - Cidr: 54.182.154.0/23                                                         │
│     - Cidr: 54.182.156.0/22                                                         │
│     - Cidr: 54.182.160.0/21                                                         │
│     - Cidr: 54.182.172.0/22                                                         │
│     - Cidr: 54.182.176.0/21                                                         │
│     - Cidr: 54.182.184.0/22                                                         │
│     - Cidr: 54.182.188.0/23                                                         │
│     - Cidr: 54.182.224.0/21                                                         │
│     - Cidr: 54.182.240.0/21                                                         │
│     - Cidr: 54.182.248.0/22                                                         │
│     - Cidr: 54.239.134.0/23                                                         │
│     - Cidr: 54.239.170.0/23                                                         │
│     - Cidr: 54.239.204.0/22                                                         │
│     - Cidr: 54.239.208.0/21                                                         │
│     - Cidr: 64.252.128.0/18                                                         │
│     - Cidr: 64.252.64.0/18                                                          │
│     - Cidr: 70.132.0.0/18                                                           │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ name: com.amazonaws.global.groundstation                                            │
│ managedByUs: NO                                                                     │
│ live:                                                                               │
│   PrefixListId: pl-0e5696d987d033653                                                │
│   AddressFamily: IPv4                                                               │
│   State: create-complete                                                            │
│   PrefixListArn: arn:aws:ec2:us-east-1:aws:prefix-list/pl-0e5696d987d033653         │
│   PrefixListName: com.amazonaws.global.groundstation                                │
│   Tags: []                                                                          │
│   OwnerId: AWS                                                                      │
│   Entries:                                                                          │
│     - Cidr: 3.2.16.0/20                                                             │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ name: com.amazonaws.us-east-1.dynamodb                                              │
│ managedByUs: NO                                                                     │
│ live:                                                                               │
│   PrefixListId: pl-02cd2c6b                                                         │
│   AddressFamily: IPv4                                                               │
│   State: create-complete                                                            │
│   PrefixListArn: arn:aws:ec2:us-east-1:aws:prefix-list/pl-02cd2c6b                  │
│   PrefixListName: com.amazonaws.us-east-1.dynamodb                                  │
│   Tags:                                                                             │
│     - Key: gc-created-by-provider                                                   │
│       Value: aws                                                                    │
│     - Key: gc-managed-by                                                            │
│       Value: grucloud                                                               │
│     - Key: gc-project-name                                                          │
│       Value: subnet                                                                 │
│     - Key: gc-stage                                                                 │
│       Value: dev                                                                    │
│     - Key: Name                                                                     │
│       Value: com.amazonaws.us-east-1.dynamodb                                       │
│   OwnerId: AWS                                                                      │
│   Entries:                                                                          │
│     - Cidr: 3.218.180.0/23                                                          │
│     - Cidr: 3.218.182.0/24                                                          │
│     - Cidr: 35.71.68.0/23                                                           │
│     - Cidr: 35.71.70.0/24                                                           │
│     - Cidr: 52.119.224.0/20                                                         │
│     - Cidr: 52.94.0.0/22                                                            │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ name: com.amazonaws.us-east-1.s3                                                    │
│ managedByUs: NO                                                                     │
│ live:                                                                               │
│   PrefixListId: pl-63a5400a                                                         │
│   AddressFamily: IPv4                                                               │
│   State: create-complete                                                            │
│   PrefixListArn: arn:aws:ec2:us-east-1:aws:prefix-list/pl-63a5400a                  │
│   PrefixListName: com.amazonaws.us-east-1.s3                                        │
│   Tags:                                                                             │
│     - Key: gc-created-by-provider                                                   │
│       Value: aws                                                                    │
│     - Key: gc-managed-by                                                            │
│       Value: grucloud                                                               │
│     - Key: gc-project-name                                                          │
│       Value: subnet                                                                 │
│     - Key: gc-stage                                                                 │
│       Value: dev                                                                    │
│     - Key: Name                                                                     │
│       Value: com.amazonaws.us-east-1.s3                                             │
│   OwnerId: AWS                                                                      │
│   Entries:                                                                          │
│     - Cidr: 18.34.0.0/19                                                            │
│     - Cidr: 18.34.232.0/21                                                          │
│     - Cidr: 3.5.0.0/19                                                              │
│     - Cidr: 52.216.0.0/15                                                           │
│     - Cidr: 54.231.0.0/16                                                           │
│                                                                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-prefix                                                                     │
│ managedByUs: Yes                                                                    │
│ live:                                                                               │
│   PrefixListId: pl-0d5a518af093e877a                                                │
│   AddressFamily: IPv4                                                               │
│   State: create-complete                                                            │
│   PrefixListArn: arn:aws:ec2:us-east-1:840541460064:prefix-list/pl-0d5a518af093e87… │
│   PrefixListName: my-prefix                                                         │
│   MaxEntries: 5                                                                     │
│   Version: 1                                                                        │
│   Tags:                                                                             │
│     - Key: gc-created-by-provider                                                   │
│       Value: aws                                                                    │
│     - Key: gc-managed-by                                                            │
│       Value: grucloud                                                               │
│     - Key: gc-project-name                                                          │
│       Value: prefix-list                                                            │
│     - Key: gc-stage                                                                 │
│       Value: dev                                                                    │
│     - Key: Name                                                                     │
│       Value: my-prefix                                                              │
│   OwnerId: 840541460064                                                             │
│   Entries:                                                                          │
│     - Cidr: 10.0.0.0/24                                                             │
│     - Cidr: 10.0.1.0/24                                                             │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                │
├────────────────────────┬───────────────────────────────────────────────────────────┤
│ EC2::ManagedPrefixList │ com.amazonaws.global.cloudfront.origin-facing             │
│                        │ com.amazonaws.global.groundstation                        │
│                        │ com.amazonaws.us-east-1.dynamodb                          │
│                        │ com.amazonaws.us-east-1.s3                                │
│                        │ my-prefix                                                 │
└────────────────────────┴───────────────────────────────────────────────────────────┘
5 resources, 1 type, 1 provider
Command "gc l -t ManagedPrefixList" executed in 5s, 103 MB
```
