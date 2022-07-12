---
id: PlacementGroup
title: Placement Group
---

Provides an [EC2 Placement Group](https://console.aws.amazon.com/ec2/v2/home?#PlacementGroups:)

```js
exports.createResources = () => [
  {
    type: "PlacementGroup",
    group: "EC2",
    properties: ({}) => ({
      GroupName: "my-placementgroup",
      Strategy: "cluster",
    }),
  },
];
```

### Properties

- [CreatePlacementGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-ec2/interfaces/createplacementgroupcommandinput.html)

### Examples

- [placement group cluster](https://github.com/grucloud/grucloud/blob/main/examples/aws/EC2/placement-group-cluster)

### Used By

- [EC2 Instance](./Instance.md)

## Listing

```sh
gc l -t PlacementGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1 
  ✓ Initialising
  ✓ Listing 1/1
┌─────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EC2::PlacementGroup from aws                                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-placementgroup                                                             │
│ managedByUs: Yes                                                                    │
│ live:                                                                               │
│   GroupName: my-placementgroup                                                      │
│   State: available                                                                  │
│   Strategy: cluster                                                                 │
│   GroupId: pg-090d5c7684292e86e                                                     │
│   Tags:                                                                             │
│     - Key: gc-created-by-provider                                                   │
│       Value: aws                                                                    │
│     - Key: gc-managed-by                                                            │
│       Value: grucloud                                                               │
│     - Key: gc-project-name                                                          │
│       Value: placement-group-cluster                                                │
│     - Key: gc-stage                                                                 │
│       Value: dev                                                                    │
│     - Key: Name                                                                     │
│       Value: my-placementgroup                                                      │
│   GroupArn: arn:aws:ec2:us-east-1:840541460064:placement-group/my-placementgroup    │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                │
├─────────────────────┬──────────────────────────────────────────────────────────────┤
│ EC2::PlacementGroup │ my-placementgroup                                            │
└─────────────────────┴──────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t PlacementGroup" executed in 4s, 100 MB
```
