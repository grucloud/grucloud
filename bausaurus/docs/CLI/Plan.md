---
id: Plan
title: gc plan
---

The **plan** commands finds out which resources need to be deployed or destroyed. It interrogates the cloud service provider to retrieve the currently deployed resources and compare it to the desired state.

```sh
gc plan
```

```txt
Querying resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::Subnet from aws                                                              │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────────────────────────┐   │
│ │ CREATE: vpc::subnet-a                                                         │   │
│ ├───────────────────────────────────────────────────────────────────────────────┤   │
│ │ MapPublicIpOnLaunch: false                                                    │   │
│ │ MapCustomerOwnedIpOnLaunch: false                                             │   │
│ │ AssignIpv6AddressOnCreation: false                                            │   │
│ │ EnableDns64: false                                                            │   │
│ │ Ipv6Native: false                                                             │   │
│ │ AvailabilityZone: us-east-1a                                                  │   │
│ │ VpcId: << VpcId of vpc not available yet >>                                   │   │
│ │ TagSpecifications:                                                            │   │
│ │   - ResourceType: subnet                                                      │   │
│ │     Tags:                                                                     │   │
│ │       - Key: gc-created-by-provider                                           │   │
│ │         Value: aws                                                            │   │
│ │       - Key: gc-managed-by                                                    │   │
│ │         Value: grucloud                                                       │   │
│ │       - Key: gc-project-name                                                  │   │
│ │         Value: subnet-simple                                                  │   │
│ │       - Key: gc-stage                                                         │   │
│ │         Value: dev                                                            │   │
│ │       - Key: mykey                                                            │   │
│ │         Value: myvalue                                                        │   │
│ │       - Key: Name                                                             │   │
│ │         Value: subnet-a                                                       │   │
│ │                                                                               │   │
│ └───────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::Vpc from aws                                                                 │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────────────────────────────┐   │
│ │ CREATE: vpc                                                                   │   │
│ ├───────────────────────────────────────────────────────────────────────────────┤   │
│ │ DnsSupport: true                                                              │   │
│ │ DnsHostnames: false                                                           │   │
│ │ CidrBlock: 192.168.0.0/16                                                     │   │
│ │ TagSpecifications:                                                            │   │
│ │   - ResourceType: vpc                                                         │   │
│ │     Tags:                                                                     │   │
│ │       - Key: gc-created-by-provider                                           │   │
│ │         Value: aws                                                            │   │
│ │       - Key: gc-managed-by                                                    │   │
│ │         Value: grucloud                                                       │   │
│ │       - Key: gc-project-name                                                  │   │
│ │         Value: subnet-simple                                                  │   │
│ │       - Key: gc-stage                                                         │   │
│ │         Value: dev                                                            │   │
│ │       - Key: Name                                                             │   │
│ │         Value: vpc                                                            │   │
│ │                                                                               │   │
│ └───────────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────┘


┌──────────────────────────────────────────────────────────────────────────────────┐
│ Plan summary for provider aws                                                    │
├──────────────────────────────────────────────────────────────────────────────────┤
│ DEPLOY RESOURCES                                                                 │
├─────────────┬────────────────────────────────────────────────────────────────────┤
│ EC2::Subnet │ vpc::subnet-a                                                      │
├─────────────┼────────────────────────────────────────────────────────────────────┤
│ EC2::Vpc    │ vpc                                                                │
└─────────────┴────────────────────────────────────────────────────────────────────┘
2 resources to deploy on 1 provider
Command "gc p" executed in 3s, 60 MB
```

## Command options

```sh
gc help plan
```

```txt
Usage: gc plan|p [options]

Find out which resources need to be deployed or destroyed

Options:
  -p, --provider <value>  Filter by provider, multiple values allowed
  -h, --help              display help for command
```
