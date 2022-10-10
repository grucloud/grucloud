---
id: ClusterParameterGroup
title: Cluster Parameter Group
---

Manages a [Redshift Cluster Parameter Group](https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html).

## Example

```js
exports.createResources = () => [
  {
    type: "ClusterParameterGroup",
    group: "Redshift",
    properties: ({}) => ({
      ParameterGroupName: "group-1",
      ParameterGroupFamily: "redshift-1.0",
      Description: "group 1",
    }),
  },
];
```

## Code Examples

- [redshift simple](https://github.com/grucloud/grucloud/blob/main/examples/aws/Redshift/redshift-simple)

## Properties

- [CreateClusterParameterGroupCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-redshift/interfaces/createclusterparametergroupcommandinput.html)

## Used By

- [Redshift Cluster](./Cluster.md)

## List

```sh
gc l -t ClusterParameterGroup
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 2 Redshift::ClusterParameterGroup from aws                                        │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: default.redshift-1.0                                                        │
│ managedByUs: NO                                                                   │
│ live:                                                                             │
│   ParameterGroupName: default.redshift-1.0                                        │
│   ParameterGroupFamily: redshift-1.0                                              │
│   Description: Default parameter group for redshift-1.0                           │
│   Tags:                                                                           │
│     - Key: gc-created-by-provider                                                 │
│       Value: aws                                                                  │
│     - Key: gc-managed-by                                                          │
│       Value: grucloud                                                             │
│     - Key: gc-project-name                                                        │
│       Value: redshift-simple                                                      │
│     - Key: gc-stage                                                               │
│       Value: dev                                                                  │
│     - Key: Name                                                                   │
│       Value: default.redshift-1.0                                                 │
│                                                                                   │
├───────────────────────────────────────────────────────────────────────────────────┤
│ name: group-1                                                                     │
│ managedByUs: Yes                                                                  │
│ live:                                                                             │
│   ParameterGroupName: group-1                                                     │
│   ParameterGroupFamily: redshift-1.0                                              │
│   Description: group 1                                                            │
│   Tags:                                                                           │
│     - Key: gc-created-by-provider                                                 │
│       Value: aws                                                                  │
│     - Key: gc-managed-by                                                          │
│       Value: grucloud                                                             │
│     - Key: gc-project-name                                                        │
│       Value: redshift-simple                                                      │
│     - Key: gc-stage                                                               │
│       Value: dev                                                                  │
│     - Key: Name                                                                   │
│       Value: group-1                                                              │
│                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
├─────────────────────────────────┬────────────────────────────────────────────────┤
│ Redshift::ClusterParameterGroup │ default.redshift-1.0                           │
│                                 │ group-1                                        │
└─────────────────────────────────┴────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t ClusterParameterGroup" executed in 3s, 98 MB
```
