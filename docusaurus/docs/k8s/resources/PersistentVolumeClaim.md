---
id: PersistentVolumeClaim
title: Persistent Volume Claim
---

Manages a Persistent Volume Claim

## List

```sh
gc list --types PersistentVolumeClaim
```

```sh
Listing resources on 1 provider: k8s
✓ k8s
  ✓ Initialising
  ✓ Listing 4/4
┌────────────────────────────────────────────────────────────────────────────────┐
│ 1 PersistentVolumeClaim from k8s                                               │
├──────────────────┬──────────────────────────────────────────────────────┬──────┤
│ Name             │ Data                                                 │ Our  │
├──────────────────┼──────────────────────────────────────────────────────┼──────┤
│ pv-db-postgres-0 │ metadata:                                            │ NO   │
│                  │   name: pv-db-postgres-0                             │      │
│                  │   namespace: default                                 │      │
│                  │   selfLink: /api/v1/namespaces/default/persistentvo… │      │
│                  │   uid: 414be8cc-d38b-43ba-a1b6-6e1a96f4ac55          │      │
│                  │   resourceVersion: 118331                            │      │
│                  │   creationTimestamp: 2021-03-23T15:36:24Z            │      │
│                  │   labels:                                            │      │
│                  │     app: db                                          │      │
│                  │   annotations:                                       │      │
│                  │     pv.kubernetes.io/bind-completed: yes             │      │
│                  │     pv.kubernetes.io/bound-by-controller: yes        │      │
│                  │     volume.beta.kubernetes.io/storage-provisioner: … │      │
│                  │     volume.kubernetes.io/selected-node: ip-192-168-… │      │
│                  │   finalizers:                                        │      │
│                  │     - "kubernetes.io/pvc-protection"                 │      │
│                  │ spec:                                                │      │
│                  │   accessModes:                                       │      │
│                  │     - "ReadWriteOnce"                                │      │
│                  │   resources:                                         │      │
│                  │     requests:                                        │      │
│                  │       storage: 1Gi                                   │      │
│                  │   volumeName: pvc-414be8cc-d38b-43ba-a1b6-6e1a96f4a… │      │
│                  │   storageClassName: gp2                              │      │
│                  │   volumeMode: Filesystem                             │      │
│                  │ status:                                              │      │
│                  │   phase: Bound                                       │      │
│                  │   accessModes:                                       │      │
│                  │     - "ReadWriteOnce"                                │      │
│                  │   capacity:                                          │      │
│                  │     storage: 1Gi                                     │      │
│                  │                                                      │      │
└──────────────────┴──────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: k8s
┌───────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                           │
├────────────────────┬──────────────────────────────────────────────────────────┤
│ PersistentVolumeC… │ pv-db-postgres-0                                         │
└────────────────────┴──────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc list --types PersistentVolumeClaim" executed in 2s
```

## UsedBy

- [PersistentVolume](./PersistentVolume)
