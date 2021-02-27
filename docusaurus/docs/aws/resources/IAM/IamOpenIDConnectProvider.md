---
id: IamOpenIDConnectProvider
title: Iam OpenIDConnectProvider
---

Provides an Iam Open ID Connect Provider.

The following example creates a Open ID Connect Provider for an EKS Cluster.

```js
const iamOpenIdConnectProvider = await provider.makeIamOpenIDConnectProvider({
  name: "oidp-eks",
  dependencies: { cluster },
  properties: ({ dependencies: { cluster } }) => ({
    Url: get(
      "live.identity.oidc.issuer",
      "oidc.issuer not available yet"
    )(cluster),
    ClientIDList: ["sts.amazonaws.com"],
  }),
});
```

### Examples

- [eks example](https://github.com/grucloud/grucloud/blob/main/examples/aws/eks/iac.js)

### Properties

- [properties list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/IAM.html#createOpenIDConnectProvider-property)

### Dependencies

- [EKSCluster](..EKS/EksCluster)

### Aws Docs

- [Creating OpenID Connect (OIDC) identity providers](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_create_oidc.html)
- [Create an IAM OIDC provider for your cluster](https://docs.aws.amazon.com/eks/latest/userguide/enable-iam-roles-for-service-accounts.html)
