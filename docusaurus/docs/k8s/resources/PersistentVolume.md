---
id: PersistentVolume
title: PersistentVolume
---

Provides a [Kubernetes PersistentVolume](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

## Examples

### Create a Persistent Volume

```js
const namespace = provider.makeNamespace({
  name: "myNamespace",
});

const persistentVolume = provider.makePersistentVolume({
  name: "myPvName",
  dependencies: { namespace },
  properties: () => ({
    spec: {
      accessModes: ["ReadWriteOnce"],
      capacity: {
        storage: "2Gi",
      },
      hostPath: {
        path: "/data/pv0001/",
      },
    },
  }),
});
```

## Source Code Examples

- [starhackit](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/charts/postgres.js#L29)

## List

The following command lists the **PersistentVolume**.

```sh
gc list -t PersistentVolume
```

```sh
Listing resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Listing 4/4
┌───────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 2 PersistentVolume from k8s                                                                               │
├──────────────────────────────────────────┬─────────────────────────────────────────────────────────┬──────┤
│ Name                                     │ Data                                                    │ Our  │
├──────────────────────────────────────────┼─────────────────────────────────────────────────────────┼──────┤
│ pv-db                                    │ metadata:                                               │ Yes  │
│                                          │   name: pv-db                                           │      │
│                                          │   selfLink: /api/v1/persistentvolumes/pv-db             │      │
│                                          │   uid: 3772985b-72cb-4ab3-b539-7ec2fcbafad4             │      │
│                                          │   resourceVersion: 117979                               │      │
│                                          │   creationTimestamp: 2021-03-23T15:36:17Z               │      │
│                                          │   annotations:                                          │      │
│                                          │     CreatedByProvider: k8s                              │      │
│                                          │     ManagedBy: GruCloud                                 │      │
│                                          │     Name: pv-db                                         │      │
│                                          │     stage: dev                                          │      │
│                                          │   finalizers:                                           │      │
│                                          │     - "kubernetes.io/pv-protection"                     │      │
│                                          │ spec:                                                   │      │
│                                          │   capacity:                                             │      │
│                                          │     storage: 2Gi                                        │      │
│                                          │   hostPath:                                             │      │
│                                          │     path: /data/pv0001/                                 │      │
│                                          │     type:                                               │      │
│                                          │   accessModes:                                          │      │
│                                          │     - "ReadWriteOnce"                                   │      │
│                                          │   persistentVolumeReclaimPolicy: Retain                 │      │
│                                          │   volumeMode: Filesystem                                │      │
│                                          │ status:                                                 │      │
│                                          │   phase: Available                                      │      │
│                                          │                                                         │      │
├──────────────────────────────────────────┼─────────────────────────────────────────────────────────┼──────┤

[...Truncated]
List Summary:
Provider: k8s
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                                                      │
├────────────────────┬─────────────────────────────────────────────────────────────────────────────────────┤
│ PersistentVolume   │ pv-db                                                                               │
│                    │ pvc-414be8cc-d38b-43ba-a1b6-6e1a96f4ac55                                            │
├────────────────────┼─────────────────────────────────────────────────────────────────────────────────────┤
│ PersistentVolumeC… │ pv-db-postgres-0                                                                    │
└────────────────────┴─────────────────────────────────────────────────────────────────────────────────────┘
3 resources, 2 types, 1 provider

```

## Dependencies

- [Namespace](./Namespace)
