---
id: EksNodeGroup
title: Node Group
---

Provides an [EKS Node Group](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html).

## Examples

### Create a Node Group

```js
const iamPolicyEKSWorkerNode = await provider.useIamPolicyReadOnly({
  name: "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
});

const iamPolicyEC2ContainerRegistryReadOnly = await provider.useIamPolicyReadOnly(
  {
    name: "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly",
  }
);
const roleNodeGroup = await provider.makeIamRole({
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

const cluster = //See demo
const subnetPrivate = //See demo

const nodeGroup = await provider.makeEKSNodeGroup({
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
