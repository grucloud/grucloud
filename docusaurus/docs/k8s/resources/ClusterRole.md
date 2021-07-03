---
id: ClusterRole
title: Cluster Role
---

Provides a [Kubernetes Cluster Role](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)

## Examples

### Create a Cluster Role

```js
const clusterRole = provider.makeClusterRole({
  name: "aws-load-balancer-controller-role",
  properties: () => ({
    metadata: {
      labels: {
        "app.kubernetes.io/name": "alb-ingress-controller",
      },
    },
    rules: [
      {
        apiGroups: ["", "extensions"],
        resources: [
          "configmaps",
          "endpoints",
          "events",
          "ingresses",
          "ingresses/status",
          "services",
          "pods/status",
        ],
        verbs: ["create", "get", "list", "update", "watch", "patch"],
      },
      {
        apiGroups: ["", "extensions"],
        resources: ["nodes", "pods", "secrets", "services", "namespaces"],
        verbs: ["get", "list", "watch"],
      },
    ],
  }),
});
```

## Source Code Examples

- [Cluster Role for the aws load balancer](https://github.com/grucloud/grucloud/blob/main/packages/modules/k8s/aws-load-balancer/resources.js#L373)

## Used By

- [ClusterRoleBinding](./ClusterRoleBinding)

## Listing

The following commands list the **ClusterRole** type:

```sh
gc list --types ClusterRole
```

Short version:

```sh
gc l -t ClusterRole
```

```sh

```
