---
id: RoleBinding
title: Role Binding
---

Provides a [Kubernetes Cluster Role Binding](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)

## Examples

### Create a Role Binding

```js
const roleBinding = await provider.makeClusterRoleBinding({
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

- [Role Binding for the aws load balancer](https://github.com/grucloud/grucloud/blob/main/packages/modules/k8s/aws-load-balancer/resources.js#L478)

## Used By

- [Role](./Role)

## Listing

The following commands list the **RoleBinding** type:

```sh
gc list --types RoleBinding
```

Short version:

```sh
gc l -t RoleBinding
```

```sh

```
