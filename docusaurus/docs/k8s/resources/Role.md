---
id: Role
title: Role
---

Provides a [Kubernetes Role](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)

## Examples

### Create a Role

```js
const role = provider.makeRole({
  name: "aws-load-balancer-controller-leader-election-role",
  properties: () => ({
    metadata: {
      labels: {
        "app.kubernetes.io/name": "aws-load-balancer-controller",
      },
      namespace: "kube-system",
    },
    rules: [
      {
        apiGroups: [""],
        resources: ["configmaps"],
        verbs: ["create"],
      },
      {
        apiGroups: [""],
        resourceNames: ["aws-load-balancer-controller-leader"],
        resources: ["configmaps"],
        verbs: ["get", "update", "patch"],
      },
    ],
  }),
});
```

## Source Code Examples

- [Role for the aws load balancer](https://github.com/grucloud/grucloud/blob/main/packages/modules/k8s/aws-load-balancer/resources.js#L373)

## Used By

- [RoleBinding](./RoleBinding)

## Listing

The following commands list the **Role** type:

```sh
gc list --types Role
```

Short version:

```sh
gc l -t Role
```

```sh

```
