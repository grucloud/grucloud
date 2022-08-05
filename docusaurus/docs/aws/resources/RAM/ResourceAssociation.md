---
id: ResourceAssociation
title: Resource Association
---

Provides a [RAM Resource Association](https://console.aws.amazon.com/ram/home?#Home:)

```js
exports.createResources = () => [
  {
    type: "ResourceAssociation",
    group: "RAM",
    properties: ({}) => ({
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "ipam-org-share",
      ipamPool: "private_org_ipam_scope",
    }),
  },
  {
    type: "ResourceAssociation",
    group: "RAM",
    properties: ({}) => ({
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "r53r-org-share",
      resolverRule: "root-env",
    }),
  },
  {
    type: "ResourceAssociation",
    group: "RAM",
    properties: ({}) => ({
      external: false,
    }),
    dependencies: ({}) => ({
      resourceShare: "tgw-org-share",
      transitGateway: "Org_TGW_dev",
    }),
  },
];
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/tree/main/examples/aws/RAM/resource-share)
- [aws-network-hub](https://github.com/grucloud/grucloud/tree/main/examples/aws/aws-samples/aws-network-hub-for-terraform)s

### Properties

- [AssociateResourceShareCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ram/interfaces/associateresourcesharecommandinput.html)

### Dependencies

- [RAM Resource Share](../RAM/ResourceShare.md)
- [EC2 Ipam Pool](../EC2/IpamPool.md)
- [EC2 Subnet](../EC2/Subnet.md)
- [EC2 Transit Gateway](../EC2/TransitGateway.md)
- [Route53Resolver Rule](../Route53Resolver/Rule.md)

### Used By

### List

```sh
gc l -t RAM::ResourceAssociation
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────┐
│ 1 RAM::ResourceAssociation from aws                                       │
├───────────────────────────────────────────────────────────────────────────┤
│ name: ram-resource-assoc::my-share::undefined                             │
│ managedByUs: NO                                                           │
│ live:                                                                     │
│   associatedEntity: arn:aws:ec2:us-east-1:840541460064:subnet/subnet-0cb… │
│   associationType: RESOURCE                                               │
│   creationTime: 2022-08-05T22:01:37.122Z                                  │
│   external: false                                                         │
│   lastUpdatedTime: 2022-08-05T22:01:38.324Z                               │
│   resourceShareArn: arn:aws:ram:us-east-1:840541460064:resource-share/12… │
│   resourceShareName: my-share                                             │
│   status: ASSOCIATED                                                      │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────┐
│ aws                                                                      │
├──────────────────────────┬───────────────────────────────────────────────┤
│ RAM::ResourceAssociation │ ram-resource-assoc::my-share::undefined       │
└──────────────────────────┴───────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t RAM::ResourceAssociation" executed in 5s, 104 MB
```
