---
id: CacheSubnetGroup
title: CacheSubnetGroup
---

Manages an [ElastiCache Subnet Group](https://console.aws.amazon.com/elasticache/home#/subnet-groups).

## Sample code

```js
exports.createResources = () => [
  {
    type: "CacheSubnetGroup",
    group: "ElastiCache",
    properties: ({}) => ({
      CacheSubnetGroupName: "my-subnet-group",
      CacheSubnetGroupDescription: " ",
      Tags: [
        {
          Key: "mykey",
          Value: "myvalue",
        },
      ],
    }),
    dependencies: ({ config }) => ({
      subnets: [
        `vpc::subnet-private1-${config.region}a`,
        `vpc::subnet-private2-${config.region}b`,
      ],
    }),
  },
];
```

## Properties

- [CreateCacheSubnetGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-elasticache/interfaces/createcachesubnetgroupcommandinput.html)

## Dependencies

- [EC2 Subnet](../EC2/Subnet.md)

## Used By

- [ElastiCache Cluster](../ElastiCache/CacheCluster.md)

## Full Examples

- [elasticache simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/ElastiCache/elasticache-simple)

## List

```sh
gc l -t ElastiCache::CacheSubnetGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────┐
│ 1 ElastiCache::CacheCacheSubnetGroup from aws                           │
├─────────────────────────────────────────────────────────────────────────┤
│ name: my-subnet-group                                                   │
│ managedByUs: Yes                                                        │
│ live:                                                                   │
│   CacheSubnetGroupName: my-subnet-group                                 │
│   CacheSubnetGroupDescription:                                          │
│   VpcId: vpc-0ae280b8fe96edc95                                          │
│   Subnets:                                                              │
│     - SubnetIdentifier: subnet-00ae435e1fc642678                        │
│       SubnetAvailabilityZone:                                           │
│         Name: us-east-1a                                                │
│     - SubnetIdentifier: subnet-073fc60ec88752d10                        │
│       SubnetAvailabilityZone:                                           │
│         Name: us-east-1b                                                │
│   ARN: arn:aws:elasticache:us-east-1:840541460064:subnetgroup:my-subne… │
│   Tags:                                                                 │
│     - Key: mykey                                                        │
│       Value: myvalue                                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────┐
│ aws                                                                    │
├────────────────────────────────────┬───────────────────────────────────┤
│ ElastiCache::CacheCacheSubnetGroup │ my-subnet-group                   │
└────────────────────────────────────┴───────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ElastiCache::CacheCacheSubnetGroup" executed in 8s, 105 MB
```
