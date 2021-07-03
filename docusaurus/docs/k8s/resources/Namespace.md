---
id: Namespace
title: Namespace
---

Provides a [Kubernetes Namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/)

## Examples

### Create a namespace

```js
const namespace = provider.makeNamespace({
  name: "myNamespace",
});
```

## Source Code Examples

- [starhackit](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/k8sStackBase.js#L14)

## Listing

The following commands list the **Namespace** type:

```sh
gc list --types Namespace
```

Short version:

```sh
gc l -t Nam
```

```sh
List Summary:
Provider: k8s
┌─────────────────────────────────────────────────────────────┐
│ k8s                                                         │
├────────────────────┬────────────────────────────────────────┤
│ Namespace          │ cert-manager                           │
│                    │ default                                │
│                    │ kube-node-lease                        │
│                    │ kube-public                            │
│                    │ kube-system                            │
└────────────────────┴────────────────────────────────────────┘
5 resources, 1 type, 1 provider
Command "gc list --types Namespace" executed in 1s

```

## UsedBy

- [Deployment](./Deployment)
- [StatefulSet](./StatefulSet)
- [Ingress](./Ingress)
- [ConfigMap](./ConfigMap)
- [Secret](./Secret)
- [Service](./Service)
