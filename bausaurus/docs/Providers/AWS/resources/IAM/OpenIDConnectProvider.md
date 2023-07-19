---
id: OpenIDConnectProvider
title: OpenIDConnectProvider
---

Provides an Iam Open ID Connect Provider.

The following example creates a Open ID Connect Provider for an EKS Cluster.

Upon creation, the SSL certicate chain is fetched from the `identity.oidc.issuer` URL provided by the EKS cluster. The thumbprint of the last certificate is formatted, it is required as an input for the creation of the OpenIDConnectProvider resource.

```js
exports.createResources = () => [
  {
    type: "OpenIDConnectProvider",
    group: "IAM",
    dependencies: () => ({ cluster: "my-cluster" }),
  },
];
```

### Examples

- [openid-connect-github](https://github.com/grucloud/grucloud/blob/main/packages/examples/aws/aws-cdk-examples/openid-connect-github)
- [eks simple](https://github.com/grucloud/grucloud/blob/main/packages/examples/aws/EKS/eks-simple)

### Properties

- [CreateOpenIDConnectProviderCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iam/interfaces/createopenidconnectprovidercommandinput.html)

### Dependencies

- [EKS Cluster](../EKS/Cluster.md)

### Used By

- [IAM Role](./Role.md)

### List

```sh
gc l -t IAM::OpenIDConnectProvider
```

```txt
Listing resources on 1 provider: aws
✓ aws us-east-1
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────────┐
│ 1 IAM::OpenIDConnectProvider from aws                                                 │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ name: oidp::token.actions.githubusercontent.com                                       │
│ managedByUs: Yes                                                                      │
│ live:                                                                                 │
│   ClientIDList:                                                                       │
│     - "sts.amazonaws.com"                                                             │
│   ThumbprintList:                                                                     │
│     - "e7eea674ca718e3befd90858e09f8372ad0ae2aa"                                      │
│   Url: token.actions.githubusercontent.com                                            │
│   CreateDate: 2022-07-30T11:12:30.676Z                                                │
│   Arn: arn:aws:iam::840541460064:oidc-provider/token.actions.githubusercontent.com    │
│   Tags:                                                                               │
│     - Key: gc-created-by-provider                                                     │
│       Value: aws                                                                      │
│     - Key: gc-managed-by                                                              │
│       Value: grucloud                                                                 │
│     - Key: gc-project-name                                                            │
│       Value: openid-connect-github                                                    │
│     - Key: gc-stage                                                                   │
│       Value: dev                                                                      │
│     - Key: Name                                                                       │
│       Value: oidp::token.actions.githubusercontent.com                                │
│                                                                                       │
└───────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                                  │
├────────────────────────────┬─────────────────────────────────────────────────────────┤
│ IAM::OpenIDConnectProvider │ oidp::token.actions.githubusercontent.com               │
└────────────────────────────┴─────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t IAM::OpenIDConnectProvider" executed in 6s, 109 MBs
```

### Aws Docs

- [Creating OpenID Connect (OIDC) identity providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [Create an IAM OIDC provider for your cluster](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html)
- [Obtaining the root CA thumbprint for an OpenID Connect Identity Provider](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html)
