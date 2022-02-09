---
id: Cluster
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
exports.createResources = () => [
  {
    type: "Cluster",
    group: "EKS",
    name: "my-cluster",
    properties: ({}) => ({
      version: "1.20",
    }),
    dependencies: () => ({
      subnets: [
        "SubnetPrivateUSEAST1D",
        "SubnetPrivateUSEAST1F",
        "SubnetPublicUSEAST1D",
        "SubnetPublicUSEAST1F",
      ],
      securityGroups: ["ControlPlaneSecurityGroup"],
      role: "eksctl-my-cluster-cluster-ServiceRole-1T8YHA5ZIYVRB",
    }),
  },
];
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

- [eks simple](https://github.com/grucloud/grucloud/tree/main/examples/aws/EKS/eks-simple)
- [eks with load balancer](https://github.com/grucloud/grucloud/tree/main/examples/aws/EKS/eks-load-balancer)

## Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EKS.html#createCluster-property)

## Dependencies

- [Subnet](../EC2/Subnet.md)
- [SecurityGroup](../EC2/SecurityGroup.md)
- [Role](../IAM/Role.md)
- [Key](../KMS/Key.md)

## List

```sh
gc l -t EKS::Cluster
```

```txt
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 6/6
┌───────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 EKS::Cluster from aws                                                                   │
├───────────────────────────────────────────────────────────────────────────────────────────┤
│ name: my-cluster                                                                          │
│ managedByUs: Yes                                                                          │
│ live:                                                                                     │
│   name: my-cluster                                                                        │
│   arn: arn:aws:eks:us-east-1:1234567890:cluster/my-cluster                                │
│   createdAt: 2021-10-23T15:13:54.383Z                                                     │
│   version: 1.20                                                                           │
│   endpoint: https://076E04BC82258CCF892CE6C7393099A2.sk1.us-east-1.eks.amazonaws.com      │
│   roleArn: arn:aws:iam::1234567890:role/eksctl-my-cluster-cluster-ServiceRole-13ASK7KN…   │
│   resourcesVpcConfig:                                                                     │
│     subnetIds:                                                                            │
│       - "subnet-0d00758befedaa8c4"                                                        │
│       - "subnet-0418a68064c4c57d9"                                                        │
│       - "subnet-054f90a7bcd3875b8"                                                        │
│       - "subnet-0666abe5c8cb6dc15"                                                        │
│     securityGroupIds:                                                                     │
│       - "sg-08a13c94f85fe6f4a"                                                            │
│     clusterSecurityGroupId: sg-0c6cb4f616e846c91                                          │
│     vpcId: vpc-04d05283d2a788120                                                          │
│     endpointPublicAccess: true                                                            │
│     endpointPrivateAccess: false                                                          │
│     publicAccessCidrs:                                                                    │
│       - "0.0.0.0/0"                                                                       │
│   kubernetesNetworkConfig:                                                                │
│     serviceIpv4Cidr: 10.100.0.0/16                                                        │
│   logging:                                                                                │
│     clusterLogging:                                                                       │
│       - types:                                                                            │
│           - "api"                                                                         │
│           - "audit"                                                                       │
│           - "authenticator"                                                               │
│           - "controllerManager"                                                           │
│           - "scheduler"                                                                   │
│         enabled: false                                                                    │
│   identity:                                                                               │
│     oidc:                                                                                 │
│       issuer: https://oidc.eks.us-east-1.amazonaws.com/id/076E04BC82258CCF892CE6C7393099… │
│   status: ACTIVE                                                                          │
│   certificateAuthority:                                                                   │
│     data: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSUM1ekNDQWMrZ0F3SUJBZ0lCQURBTkJna3Foa2… │
│   clientRequestToken: null                                                                │
│   platformVersion: eks.2                                                                  │
│   tags:                                                                                   │
│     gc-managed-by: grucloud                                                               │
│     gc-project-name: ex-eks-mod                                                           │
│     gc-stage: dev                                                                         │
│     gc-created-by-provider: aws                                                           │
│     Name: my-cluster                                                                      │
│                                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                      │
├──────────────┬───────────────────────────────────────────────────────────────────────────┤
│ EKS::Cluster │ my-cluster                                                                │
└──────────────┴───────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t EKS::Cluster" executed in 11s
```
