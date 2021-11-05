---
id: EksNodeGroup
title: Node Group
---

Provides an [EKS Node Group](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html).

## Examples

### Create a Node Group

```js
provider.EKS.makeNodeGroup({
  name: "ng-1",
  properties: ({ config }) => ({
    capacityType: "ON_DEMAND",
    scalingConfig: {
      minSize: 1,
      maxSize: 1,
      desiredSize: 1,
    },
  }),
  dependencies: ({ resources }) => ({
    cluster: resources.EKS.Cluster.myCluster,
    subnets: [
      resources.EC2.Subnet.subnetPublicUseast1A,
      resources.EC2.Subnet.subnetPublicUseast1D,
    ],
    role: resources.IAM.Role.eksctlMyClusterNodegroupNg_1NodeInstanceRole,
    launchTemplate: resources.EC2.LaunchTemplate.eksctlMyClusterNodegroupNg_1,
  }),
});
```

## Source Code Examples

- [eks](https://github.com/grucloud/grucloud/blob/main/examples/aws/eks/eks_basic/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createCluster-property)

## Dependencies

- [Cluster](./EksCluster)
- [Subnet](../EC2/Subnet)
- [LaunchTemplate](../EC2/LaunchTemplate.md)
- [Role](../Iam/IamRole)

## Listing

```sh
gc l -t EKS::NodeGroup
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 19/19
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EKS::NodeGroup from aws                                                                 │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ name: ng-1                                                                                │
│ managedByUs: Yes                                                                          │
│ live:                                                                                     │
│   nodegroupName: ng-1                                                                     │
│   nodegroupArn: arn:aws:eks:us-east-1:1234567890:nodegroup/my-cluster/ng-1/eabe56e1-9a… │
│   clusterName: my-cluster                                                                 │
│   version: 1.20                                                                           │
│   releaseVersion: 1.20.10-20211013                                                        │
│   createdAt: 2021-10-23T15:27:06.791Z                                                     │
│   modifiedAt: 2021-10-23T15:38:20.659Z                                                    │
│   status: ACTIVE                                                                          │
│   capacityType: ON_DEMAND                                                                 │
│   scalingConfig:                                                                          │
│     minSize: 1                                                                            │
│     maxSize: 1                                                                            │
│     desiredSize: 1                                                                        │
│   instanceTypes:                                                                          │
│     - "t3.medium"                                                                         │
│   subnets:                                                                                │
│     - "subnet-054f90a7bcd3875b8"                                                          │
│     - "subnet-0666abe5c8cb6dc15"                                                          │
│   amiType: AL2_x86_64                                                                     │
│   nodeRole: arn:aws:iam::1234567890:role/eksctl-my-cluster-nodegroup-ng-1-NodeInstance… │
│   labels:                                                                                 │
│     alpha.eksctl.io/cluster-name: my-cluster                                              │
│     alpha.eksctl.io/nodegroup-name: ng-1                                                  │
│   resources:                                                                              │
│     autoScalingGroups:                                                                    │
│       - name: eks-eabe56e1-9ac4-c7f0-26bf-90bf1bcc66bc                                    │
│     remoteAccessSecurityGroup: null                                                       │
│   diskSize: null                                                                          │
│   health:                                                                                 │
│     issues: []                                                                            │
│   updateConfig:                                                                           │
│     maxUnavailable: 1                                                                     │
│     maxUnavailablePercentage: null                                                        │
│   launchTemplate:                                                                         │
│     name: eksctl-my-cluster-nodegroup-ng-1                                                │
│     version: 1                                                                            │
│     id: lt-0045f65b3d11014b2                                                              │
│   tags:                                                                                   │
│     gc-managed-by: grucloud                                                               │
│     gc-project-name: ex-eks-mod                                                           │
│     gc-stage: dev                                                                         │
│     gc-created-by-provider: aws                                                           │
│     Name: ng-1                                                                            │
│                                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                      │
├────────────────┬─────────────────────────────────────────────────────────────────────────┤
│ EKS::NodeGroup │ ng-1                                                                    │
└────────────────┴─────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t NodeGroup" executed in 11s
```
