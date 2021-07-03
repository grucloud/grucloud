---
id: ConfigMap
title: ConfigMap
---

Provides a [Kubernetes ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/)

## Examples

### Create a config map

```js
const namespace = provider.makeNamespace({
  name: "myNamespace",
});

const configMap = provider.makeConfigMap({
  name: "myConfigMap",
  dependencies: { namespace },
  properties: () => ({
    data: {
      POSTGRES_USER: "dbuser",
      POSTGRES_PASSWORD: "peggy went to the market",
      POSTGRES_DB: "main",
    },
  }),
});
```

## Source Code Examples

- [config map for postgres](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/charts/postgres.js#L21)

## Dependencies

- [Namespace](./Namespace)

## Listing

The following commands list the **ConfigMap** type:

```sh
gc list --types ConfigMap
```

Short version:

```sh
gc l -t Con
```

```sh
List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
└──────────────────────────────────────────────────────────────────────────────────┘
Provider: k8s
┌──────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                              │
├────────────────────┬─────────────────────────────────────────────────────────────┤
│ ConfigMap          │ postgres                                                    │
│                    │ rest-server                                                 │
│                    │ aws-auth                                                    │
│                    │ aws-load-balancer-controller-leader                         │
│                    │ cert-manager-cainjector-leader-election                     │
│                    │ cert-manager-cainjector-leader-election-core                │
│                    │ cert-manager-controller                                     │
│                    │ coredns                                                     │
│                    │ cp-vpc-resource-controller                                  │
│                    │ eks-certificates-controller                                 │
│                    │ extension-apiserver-authentication                          │
│                    │ kube-proxy                                                  │
│                    │ kube-proxy-config                                           │
└────────────────────┴─────────────────────────────────────────────────────────────┘
13 resources, 1 type, 2 providers
Command "gc list --types ConfigMap" executed in 4s

```
