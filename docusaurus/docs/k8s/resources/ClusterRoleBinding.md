---
id: ClusterRoleBinding
title: Cluster Role Binding
---

Provides a [Kubernetes Cluster Role Binding](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)

## Examples

### Create a Cluster Role Binding

```js
const clusterRoleBinding = provider.makeClusterRoleBinding({
  name: "aws-load-balancer-controller-rolebinding",
  properties: () => ({
    metadata: {
      labels: {
        "app.kubernetes.io/name": "aws-load-balancer-controller",
      },
    },
    roleRef: {
      apiGroup: "rbac.authorization.k8s.io",
      kind: "ClusterRole",
      name: "aws-load-balancer-controller-role",
    },
    subjects: [
      {
        kind: "ServiceAccount",
        name: "aws-load-balancer-controller",
        namespace: "kube-system",
      },
    ],
  }),
});
```

## Source Code Examples

- [Cluster Role Binding for the aws load balancer](https://github.com/grucloud/grucloud/blob/main/packages/modules/k8s/aws-load-balancer/resources.js#L505)

## Used By

- [ClusterRole](./ClusterRole)

## Listing

The following commands list the **ClusterRoleBinding** type:

```sh
gc list --types ClusterRoleBinding
```

Short version:

```sh
gc l -t ClusterRoleBinding
```

```sh

```
