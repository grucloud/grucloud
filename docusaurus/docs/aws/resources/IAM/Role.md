---
id: Role
title: Role
---

Provides an Iam Role.

```js
provider.IAM.makeRole({
  name: "my-role",
  properties: () => ({
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "sts:AssumeRole",
          Principal: {
            Service: "ec2.amazonaws.com",
          },
          Effect: "Allow",
          Sid: "",
        },
      ],
    },
  }),
});
```

### Attach a policy to a role

```js
provider.IAM.makePolicy({
  name: "my-policy",
  properties: () => ({
    PolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: ["ec2:Describe*"],
          Effect: "Allow",
          Resource: "*",
        },
      ],
    },
    Description: "Allow ec2:Describe",
    Path: "/",
  }),
});

provider.IAM.makeRole({
  name: "my-role",
  dependencies: () => ({ policies: [iamPolicy] }),
  properties: () => ({
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "sts:AssumeRole",
          Principal: {
            Service: "ec2.amazonaws.com",
          },
          Effect: "Allow",
          Sid: "",
        },
      ],
    },
  }),
});
```

### Add an inline policy to a role

```js
const iamRole = provider.IAM.makeRole({
  name: "my-role",
  properties: () => ({
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "sts:AssumeRole",
          Principal: {
            Service: "ec2.amazonaws.com",
          },
          Effect: "Allow",
          Sid: "",
        },
      ],
    },
    Policies: [
      {
        PolicyDocument: {
          Version: "2012-10-17",
          Statement: [
            {
              Action: "dynamodb:*",
              Resource: [
                "arn:aws:dynamodb:eu-west-2:1234567890:table/AppsyncCdkAppStack-CDKNotesTable254A7FD1-3MPG6DUNDCO9",
              ],
              Effect: "Allow",
            },
          ],
        },
        PolicyName: "AppSyncNotesHandlerServiceRoleDefaultPolicy12C70C4F",
      },
    ],
  }),
});
```

### Add a role to an instance profile

```js
provider.IAM.makeRole({
  name: "my-role",
  properties: () => ({
    AssumeRolePolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "sts:AssumeRole",
          Principal: {
            Service: "ec2.amazonaws.com",
          },
          Effect: "Allow",
          Sid: "",
        },
      ],
    },
  }),
});

provider.IAM.makeInstanceProfile({
  name: "my-instance-profile",
  dependencies: () => ({ iamRoles: ["my-role"] }),
});
```

### Link to an OpenIdConnectProvider

The **AssumeRolePolicyDocument** will be filled with the **openIdConnectProvider** dependency.

```js

const loadBalancerPolicy = require("./load-balancer-policy.json");

const iamOpenIdConnectProvider = provider.IAM.makeOpenIDConnectProvider({
  name: "oidc",
  dependencies: () => ({ cluster }),
});

const iamLoadBalancerPolicy = provider.IAM.makePolicy({
  name: "AWSLoadBalancerControllerIAMPolicy",
  properties: () => ({
    PolicyDocument: loadBalancerPolicy,
    Description: "Load Balancer Policy",
  }),
});

const roleLoadBalancer = provider.IAM.makeRole({
  name: "roleLoadBalancer"
  dependencies: () => ({
    openIdConnectProvider: iamOpenIdConnectProvider,
    policies: [iamLoadBalancerPolicy],
  }),
});
```

### Examples

- [simple example](https://github.com/grucloud/grucloud/blob/main/examples/aws/iam/iam/iac.js)

- [load balancer controller module](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/load-balancer-controller/iac.js#)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createRole-property)

### Dependencies

- [Iam Policy](./Policy.md)
- [Iam OpenIDConnectProvider](./OpenIDConnectProvider.md)

### Used By

- [IamInstanceProfile](./InstanceProfile.md)

### List

```sh
gc list -t IamRole
```

```sh
Listing resources on 1 provider: aws
✓ aws
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ 3 iam::Role from aws                                                                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ name: role-cluster                                                                     │
│ managedByUs: Yes                                                                       │
│ live:                                                                                  │
│   Path: /                                                                              │
│   RoleName: role-cluster                                                               │
│   RoleId: AROA4HNBM2ZQBIII7KZ4Z                                                        │
│   Arn: arn:aws:iam::840541460064:role/role-cluster                                     │
│   CreateDate: 2021-07-21T13:29:11.000Z                                                 │
│   AssumeRolePolicyDocument:                                                            │
│     Version: 2012-10-17                                                                │
│     Statement:                                                                         │
│       - Effect: Allow                                                                  │
│         Principal:                                                                     │
│           Service: eks.amazonaws.com                                                   │
│         Action: sts:AssumeRole                                                         │
│   MaxSessionDuration: 3600                                                             │
│   Tags:                                                                                │
│     - Key: Name                                                                        │
│       Value: role-cluster                                                              │
│     - Key: gc-managed-by                                                               │
│       Value: grucloud                                                                  │
│     - Key: gc-created-by-provider                                                      │
│       Value: aws                                                                       │
│     - Key: gc-stage                                                                    │
│       Value: dev                                                                       │
│     - Key: gc-project-name                                                             │
│       Value: @grucloud/example-module-aws-load-balancer-controller                     │
│     - Key: gc-namespace                                                                │
│       Value: EKS                                                                       │
│   InstanceProfiles: []                                                                 │
│   AttachedPolicies:                                                                    │
│     - PolicyName: AmazonEKSClusterPolicy                                               │
│       PolicyArn: arn:aws:iam::aws:policy/AmazonEKSClusterPolicy                        │
│     - PolicyName: AmazonEKSVPCResourceController                                       │
│       PolicyArn: arn:aws:iam::aws:policy/AmazonEKSVPCResourceController                │
│   Policies: []                                                                         │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ name: role-load-balancer                                                               │
│ managedByUs: Yes                                                                       │
│ live:                                                                                  │
│   Path: /                                                                              │
│   RoleName: role-load-balancer                                                         │
│   RoleId: AROA4HNBM2ZQH2RLTJRCD                                                        │
│   Arn: arn:aws:iam::840541460064:role/role-load-balancer                               │
│   CreateDate: 2021-07-21T13:39:48.000Z                                                 │
│   AssumeRolePolicyDocument:                                                            │
│     Version: 2012-10-17                                                                │
│     Statement:                                                                         │
│       - Effect: Allow                                                                  │
│         Principal:                                                                     │
│           Federated: arn:aws:iam::840541460064:oidc-provider/oidc.eks.eu-west-2.amazo… │
│         Action: sts:AssumeRoleWithWebIdentity                                          │
│         Condition:                                                                     │
│           StringEquals:                                                                │
│             oidc.eks.eu-west-2.amazonaws.com/id/9377E3CCC52850A5BC4BEF6D012643E6:aud:… │
│   MaxSessionDuration: 3600                                                             │
│   Tags:                                                                                │
│     - Key: Name                                                                        │
│       Value: role-load-balancer                                                        │
│     - Key: gc-managed-by                                                               │
│       Value: grucloud                                                                  │
│     - Key: gc-created-by-provider                                                      │
│       Value: aws                                                                       │
│     - Key: gc-stage                                                                    │
│       Value: dev                                                                       │
│     - Key: gc-project-name                                                             │
│       Value: @grucloud/example-module-aws-load-balancer-controller                     │
│     - Key: gc-namespace                                                                │
│       Value: LoadBalancerControllerRole                                                │
│   AttachedPolicies:                                                                    │
│     - PolicyName: AWSLoadBalancerControllerIAMPolicy                                   │
│       PolicyArn: arn:aws:iam::840541460064:policy/AWSLoadBalancerControllerIAMPolicy   │
│   InstanceProfiles: []                                                                 │
│   Policies: []                                                                         │
│                                                                                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ name: role-node-group                                                                  │
│ managedByUs: Yes                                                                       │
│ live:                                                                                  │
│   Path: /                                                                              │
│   RoleName: role-node-group                                                            │
│   RoleId: AROA4HNBM2ZQAQEEDNKMM                                                        │
│   Arn: arn:aws:iam::840541460064:role/role-node-group                                  │
│   CreateDate: 2021-07-21T13:29:11.000Z                                                 │
│   AssumeRolePolicyDocument:                                                            │
│     Version: 2012-10-17                                                                │
│     Statement:                                                                         │
│       - Effect: Allow                                                                  │
│         Principal:                                                                     │
│           Service: ec2.amazonaws.com                                                   │
│         Action: sts:AssumeRole                                                         │
│   MaxSessionDuration: 3600                                                             │
│   Tags:                                                                                │
│     - Key: Name                                                                        │
│       Value: role-node-group                                                           │
│     - Key: gc-managed-by                                                               │
│       Value: grucloud                                                                  │
│     - Key: gc-created-by-provider                                                      │
│       Value: aws                                                                       │
│     - Key: gc-stage                                                                    │
│       Value: dev                                                                       │
│     - Key: gc-project-name                                                             │
│       Value: @grucloud/example-module-aws-load-balancer-controller                     │
│     - Key: gc-namespace                                                                │
│       Value: EKS                                                                       │
│   AttachedPolicies:                                                                    │
│     - PolicyName: AmazonEKSWorkerNodePolicy                                            │
│       PolicyArn: arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy                     │
│     - PolicyName: AmazonEC2ContainerRegistryReadOnly                                   │
│       PolicyArn: arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly            │
│     - PolicyName: AmazonEKS_CNI_Policy                                                 │
│       PolicyArn: arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy                          │
│   Policies: []                                                                         │
│   InstanceProfiles:                                                                    │
│     - InstanceProfileName: eks-b6bd64a5-a3dc-30a8-b4a5-f6a7fd37e90d                    │
│       InstanceProfileId: AIPA4HNBM2ZQACXAPZ3H7                                         │
│       Arn: arn:aws:iam::840541460064:instance-profile/eks-b6bd64a5-a3dc-30a8-b4a5-f6a… │
│       Path: /                                                                          │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌───────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                               │
├────────────────────────────────┬──────────────────────────────────────────────────┤
│ iam::Role                      │ role-cluster                                     │
│                                │ role-load-balancer                               │
│                                │ role-node-group                                  │
└────────────────────────────────┴──────────────────────────────────────────────────┘
3 resources, 2 types, 1 provider
Command "gc l -t Role" executed in 5s
```

### AWS CLI

List all iam roles

```
aws iam list-roles
```

Delete a role

```
aws iam delete-role --role-name role-name
```

List a role:

```
aws iam get-role --role-name my-role
```
