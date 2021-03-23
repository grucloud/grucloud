---
id: Namespace
title: Namespace
---

Provides a Namespace

## Examples

### Create a namespace

```js
const namespace = await provider.makeNamespace({
  name: config.namespaceName,
});
```

## Source Code Examples

- [starhackit](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/k8sStackBase.js#L14)

## UsedBy

- [Deployment](./Deployment)
- [StatefulSet](./StatefulSet)
- [Ingress](./Ingress)
