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
- a customer master key

```js
const cluster = provider.eks.makeCluster({
  name: "cluster",
  dependencies: {
    subnets: [...subnetPublics, ...subnetPrivates],
    securityGroups: [securityGroup],
    role,
    key,
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
- [Key](../KMS/KmsKey)

## List

```sh
gc l -t EKSCluster
```

```sh
Listing resources on 2 providers: aws, k8s
✓ aws
  ✓ Initialising
  ✓ Listing 5/5
✓ k8s
  ✓ Initialising
  ✓ Listing
┌──────────────────────────────────────────────────────────────────────────────────┐
│ 1 EKSCluster from aws                                                            │
├──────────┬────────────────────────────────────────────────────────────────┬──────┤
│ Name     │ Data                                                           │ Our  │
├──────────┼────────────────────────────────────────────────────────────────┼──────┤
│ cluster  │ name: cluster                                                  │ Yes  │
│          │ arn: arn:aws:eks:eu-west-2:840541460064:cluster/cluster        │      │
│          │ createdAt: 2021-04-16T19:17:59.258Z                            │      │
│          │ version: 1.18                                                  │      │
│          │ endpoint: https://789895ABB5E7DDFABC1AD92FA854A4B3.gr7.eu-wes… │      │
│          │ roleArn: arn:aws:iam::840541460064:role/role-cluster           │      │
│          │ resourcesVpcConfig:                                            │      │
│          │   subnetIds:                                                   │      │
│          │     - "subnet-053363a740a209ba8"                               │      │
│          │     - "subnet-0a7a0a47b7130c01f"                               │      │
│          │     - "subnet-0dff8b29620034c34"                               │      │
│          │     - "subnet-0f436523b208a068c"                               │      │
│          │   securityGroupIds:                                            │      │
│          │     - "sg-04ffe6df304c184d7"                                   │      │
│          │     - "sg-094514a64ee09d3c9"                                   │      │
│          │   clusterSecurityGroupId: sg-0a83ac7deb9323c1d                 │      │
│          │   vpcId: vpc-03b8d521b703d6c46                                 │      │
│          │   endpointPublicAccess: true                                   │      │
│          │   endpointPrivateAccess: false                                 │      │
│          │   publicAccessCidrs:                                           │      │
│          │     - "0.0.0.0/0"                                              │      │
│          │ kubernetesNetworkConfig:                                       │      │
│          │   serviceIpv4Cidr: 10.100.0.0/16                               │      │
│          │ logging:                                                       │      │
│          │   clusterLogging:                                              │      │
│          │     - types:                                                   │      │
│          │         - "api"                                                │      │
│          │         - "audit"                                              │      │
│          │         - "authenticator"                                      │      │
│          │         - "controllerManager"                                  │      │
│          │         - "scheduler"                                          │      │
│          │       enabled: false                                           │      │
│          │ identity:                                                      │      │
│          │   oidc:                                                        │      │
│          │     issuer: https://oidc.eks.eu-west-2.amazonaws.com/id/78989… │      │
│          │ status: ACTIVE                                                 │      │
│          │ certificateAuthority:                                          │      │
│          │   data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUN5RENDQWJDZ… │      │
│          │ clientRequestToken: null                                       │      │
│          │ platformVersion: eks.4                                         │      │
│          │ tags:                                                          │      │
│          │   ManagedBy: GruCloud                                          │      │
│          │   stage: dev                                                   │      │
│          │   projectName: starhackit                                      │      │
│          │   CreatedByProvider: aws                                       │      │
│          │   Name: cluster                                                │      │
│          │                                                                │      │
└──────────┴────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: k8s
┌─────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                             │
└─────────────────────────────────────────────────────────────────────────────────┘
Provider: aws
┌─────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                             │
├────────────────────┬────────────────────────────────────────────────────────────┤
│ EKSCluster         │ cluster                                                    │
└────────────────────┴────────────────────────────────────────────────────────────┘
1 resource, 1 type, 2 providers
Command "gc l -t EKSCluster" executed in 8s
```
