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
    name: "oidp-eks",
    dependencies: () => ({ cluster: "my-cluster" }),
  },
];
```

### Examples

- [load balancer controller module](https://github.com/grucloud/grucloud/blob/main/packages/modules/aws/load-balancer-controller)

### Properties

- [CreateOpenIDConnectProviderCommandInput](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-iam/interfaces/createopenidconnectprovidercommandinput.html)

### Dependencies

- [EKS Cluster](../EKS/Cluster.md)

### Aws Docs

- [Creating OpenID Connect (OIDC) identity providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [Create an IAM OIDC provider for your cluster](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html)
- [Obtaining the root CA thumbprint for an OpenID Connect Identity Provider](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc_verify-thumbprint.html)
