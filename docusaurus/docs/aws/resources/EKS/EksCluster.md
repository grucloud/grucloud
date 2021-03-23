---
id: EksCluster
title: Cluster
---

Provides an [EKS Cluster](https://aws.amazon.com/eks).

## Examples

### Create a cluster

In order to create an EKS Cluster, a few resources need to be created before:

- a VPC
- an Internet Gateway
- at least 2 public subnet
- at least 2 private subnet
- a Nat Gateway.
- route tables and routes.
- a security group
- an Iam role

```js
const cluster = await provider.makeEKSCluster({
  name: "cluster",
  dependencies: {
    subnets: [subnetPublics, subnetPrivates],
    securityGroups: [securityGroup],
    role,
  },
});
```

## On Deployed and On Destroyed

### On Deployed

When the cluster is up and running, the **kubeconfig** is updated with the new endpoint, i.e arn:aws:eks:eu-west-2:840541460064:cluster/myCluster
Under the hood, the **aws eks update-kubeconfig** command is invoked with the right cluster name.

```
aws eks update-kubeconfig --name myCluster
```

### On Destroyed

When the cluster is destroyed, the endpoint is removed from **kubeconfig**:

```
kubectl config delete-cluster arn:aws:eks:eu-west-2:840541460064:cluster/myCluster
```

## Source Code Examples

- [eks](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/eks/iac.js)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createCluster-property)

## Dependencies

- [Subnet](../EC2/Subnet)
- [SecurityGroup](../EC2/SecurityGroup)
- [Role](../Iam/IamRole)
