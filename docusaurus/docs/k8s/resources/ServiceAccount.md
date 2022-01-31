---
id: ServiceAccount
title: Service Account
---

Provides a [Kubernetes Service Account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)

## Examples

### Create a Service Account

```js
const serviceAccount = provider.makeServiceAccount({
  dependencies: { role: resources.roleLoadBalancer },
  properties: ({ dependencies: { role } }) => ({
    metadata: {
      name: "aws-load-balancer-controller",
      annotations: {
        "eks.amazonaws.com/role-arn": role?.live?.Arn,
      },
      labels: {
        "app.kubernetes.io/component": "controller",
        "app.kubernetes.io/name": "aws-load-balancer-controller",
      },
      namespace: "kube-system",
    },
  }),
});
```

## Listing

The following command lists the **ServiceAccount** type:

```sh
gc list --types ServiceAccount
```
