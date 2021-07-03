---
id: EksNodeGroup
title: Node Group
---

Provides an [EKS Node Group](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html).

## Examples

### Create a Node Group

```js
const iamPolicyEKSWorkerNode = await provider.iam.useIamPolicy({
  name: "AmazonEKSWorkerNodePolicy",
  properties: () => ({
    Arn: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
  }),
});

const iamPolicyEC2ContainerRegistryReadOnly = await provider.iam.useIamPolicy({
  name: "AmazonEC2ContainerRegistryReadOnly",
  properties: () => ({
    Arn: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
  }),
});

const roleNodeGroup = await provider.iam.makeIamRole({
  name: "role-node-group",
  dependencies: {
    policies: [iamPolicyEKSWorkerNode, iamPolicyEC2ContainerRegistryReadOnly],
  },
  properties: () => ({
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Principal: {
            Service: "ec2.amazonaws.com",
          },
          Action: "sts:AssumeRole",
        },
      ],
    },
  }),
});

const cluster = {}; //See demo
const subnetPrivate = {}; //See demo

const nodeGroup = await provider.eks.makeEKSNodeGroup({
  name: "node-group",
  dependencies: {
    subnets: [subnetPrivate],
    cluster,
    role: roleNodeGroup,
  },
});
```

## Source Code Examples

- [eks](https://github.com/grucloud/grucloud/blob/main/examples/aws/eks/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createCluster-property)

## Dependencies

- [Cluster](./EksCluster)
- [Subnet](../EC2/Subnet)
- [Role](../Iam/IamRole)

## Listing

```sh
gc l -t EKSNodeGroup
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 4/4
┌──────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2 EKSNodeGroup from aws                                                                              │
├────────────────────────────┬──────────────────────────────────────────────────────────────────┬──────┤
│ Name                       │ Data                                                             │ Our  │
├────────────────────────────┼──────────────────────────────────────────────────────────────────┼──────┤
│ node-group-private-cluster │ nodegroupName: node-group-private-cluster                        │ Yes  │
│                            │ nodegroupArn: arn:aws:eks:eu-west-2:840541460064:nodegroup/clus… │      │
│                            │ clusterName: cluster                                             │      │
│                            │ version: 1.18                                                    │      │
│                            │ releaseVersion: 1.18.9-20210329                                  │      │
│                            │ createdAt: 2021-04-07T21:21:17.588Z                              │      │
│                            │ modifiedAt: 2021-04-07T21:23:59.967Z                             │      │
│                            │ status: ACTIVE                                                   │      │
│                            │ capacityType: ON_DEMAND                                          │      │
│                            │ scalingConfig:                                                   │      │
│                            │   minSize: 1                                                     │      │
│                            │   maxSize: 1                                                     │      │
│                            │   desiredSize: 1                                                 │      │
│                            │ instanceTypes:                                                   │      │
│                            │   - "t2.medium"                                                  │      │
│                            │ subnets:                                                         │      │
│                            │   - "subnet-0e600c9492fbf10c7"                                   │      │
│                            │   - "subnet-0335cd853ab7b2cd1"                                   │      │
│                            │ amiType: AL2_x86_64                                              │      │
│                            │ nodeRole: arn:aws:iam::840541460064:role/role-node-group         │      │
│                            │ labels:                                                          │      │
│                            │ resources:                                                       │      │
│                            │   autoScalingGroups:                                             │      │
│                            │     - name: eks-52bc571a-fcb1-ae34-12e9-690fca52780d             │      │
│                            │   remoteAccessSecurityGroup: null                                │      │
│                            │ diskSize: 20                                                     │      │
│                            │ health:                                                          │      │
│                            │   issues: []                                                     │      │
│                            │ tags:                                                            │      │
│                            │   ManagedBy: GruCloud                                            │      │
│                            │   stage: dev                                                     │      │
│                            │   projectName: @grucloud/example-module-aws-eks                  │      │
│                            │   CreatedByProvider: aws                                         │      │
│                            │   Name: node-group-private-cluster                               │      │
│                            │                                                                  │      │
├────────────────────────────┼──────────────────────────────────────────────────────────────────┼──────┤
│ node-group-public-cluster  │ nodegroupName: node-group-public-cluster                         │ Yes  │
│                            │ nodegroupArn: arn:aws:eks:eu-west-2:840541460064:nodegroup/clus… │      │
│                            │ clusterName: cluster                                             │      │
│                            │ version: 1.18                                                    │      │
│                            │ releaseVersion: 1.18.9-20210329                                  │      │
│                            │ createdAt: 2021-04-07T21:21:17.654Z                              │      │
│                            │ modifiedAt: 2021-04-07T21:23:14.421Z                             │      │
│                            │ status: ACTIVE                                                   │      │
│                            │ capacityType: ON_DEMAND                                          │      │
│                            │ scalingConfig:                                                   │      │
│                            │   minSize: 1                                                     │      │
│                            │   maxSize: 1                                                     │      │
│                            │   desiredSize: 1                                                 │      │
│                            │ instanceTypes:                                                   │      │
│                            │   - "t2.medium"                                                  │      │
│                            │ subnets:                                                         │      │
│                            │   - "subnet-0bc901f569ce3e55c"                                   │      │
│                            │   - "subnet-0a56a7f4e874f99fc"                                   │      │
│                            │ amiType: AL2_x86_64                                              │      │
│                            │ nodeRole: arn:aws:iam::840541460064:role/role-node-group         │      │
│                            │ labels:                                                          │      │
│                            │ resources:                                                       │      │
│                            │   autoScalingGroups:                                             │      │
│                            │     - name: eks-66bc571a-fcb2-fdea-6810-81680a780432             │      │
│                            │   remoteAccessSecurityGroup: null                                │      │
│                            │ diskSize: 20                                                     │      │
│                            │ health:                                                          │      │
│                            │   issues: []                                                     │      │
│                            │ tags:                                                            │      │
│                            │   ManagedBy: GruCloud                                            │      │
│                            │   stage: dev                                                     │      │
│                            │   projectName: @grucloud/example-module-aws-eks                  │      │
│                            │   CreatedByProvider: aws                                         │      │
│                            │   Name: node-group-public-cluster                                │      │
│                            │                                                                  │      │
└────────────────────────────┴──────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                                 │
├────────────────────┬────────────────────────────────────────────────────────────────────────────────┤
│ EKSNodeGroup       │ node-group-private-cluster                                                     │
│                    │ node-group-public-cluster                                                      │
└────────────────────┴────────────────────────────────────────────────────────────────────────────────┘
2 resources, 1 type, 1 provider
Command "gc l -t EKSNodeGroup" executed in 10s
```
