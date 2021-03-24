---
id: StatefulSet
title: StatefulSet
---

Provides a [Kubernetes StatefulSet](https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/)

## Examples

### Create a StatefulSet for postgres

```js
const label = "myLabel";
const pvName = "pv-db";

const namespace = await provider.makeNamespace({
  name: "myNamespace",
});

const persistentVolume = await provider.makePersistentVolume({
  name: pvName,
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

const statefulSetPostgres = await provider.makeStatefulSet({
  name: "myStatefulSet",
  dependencies: { namespace, persistentVolume },
  properties: () => ({
    metadata: {
      labels: {
        app: label,
      },
    },
    spec: {
      serviceName: "postgres",
      replicas: 1,
      selector: {
        matchLabels: {
          app: label,
        },
      },
      template: {
        metadata: {
          labels: {
            app: label,
          },
        },
        spec: {
          containers: [
            {
              name: "postgres",
              image: "postgres:10-alpine",
              ports: [
                {
                  containerPort: 5432,
                  name: "postgres",
                },
              ],
              volumeMounts: [
                {
                  name: pvName,
                  mountPath: "/var/lib/postgresql",
                },
              ],
            },
          ],
        },
      },
      volumeClaimTemplates: [
        {
          metadata: {
            name: pvName,
          },
          spec: {
            accessModes: ["ReadWriteOnce"],
            resources: {
              requests: {
                storage: "2Gi",
              },
            },
          },
        },
      ],
    },
  }),
});
```

## Source Code Examples

- [postgres statefulset](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/charts/postgres.js#L134)

- [redis statefulset](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/charts/redis.js#L53)

## Listing

The following commands list the **StatefulSet** type:

```sh
gc list --types StatefulSet
```

Short version:

```sh
gc l -t Stat
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
│ StatefulSet        │ postgres                                                    │
│                    │ redis                                                       │
└────────────────────┴─────────────────────────────────────────────────────────────┘
2 resources, 1 type, 2 providers
Command "gc list --types StatefulSet" executed in 5s
```

To list a StatefulSet by name:

```
gc l -t StatefulSet -n postgres
```

```
Listing resources on 2 providers: aws, k8s
✓ aws
  ✓ Initialising
  ✓ Listing
✓ k8s
  ✓ Initialising
  ✓ Listing 6/6
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 1 StatefulSet from k8s                                                            │
├──────────┬─────────────────────────────────────────────────────────────────┬──────┤
│ Name     │ Data                                                            │ Our  │
├──────────┼─────────────────────────────────────────────────────────────────┼──────┤
│ postgres │ metadata:                                                       │ Yes  │
│          │   name: postgres                                                │      │
│          │   namespace: default                                            │      │
│          │   selfLink: /apis/apps/v1/namespaces/default/statefulsets/post… │      │
│          │   uid: b8f36ec5-7788-40bc-ad90-fb50fb8b2c62                     │      │
│          │   resourceVersion: 118835                                       │      │
│          │   generation: 1                                                 │      │
│          │   creationTimestamp: 2021-03-23T15:36:24Z                       │      │
│          │   labels:                                                       │      │
│          │     app: db                                                     │      │
│          │   annotations:                                                  │      │
│          │     CreatedByProvider: k8s                                      │      │
│          │     ManagedBy: GruCloud                                         │      │
│          │     Name: postgres                                              │      │
│          │     stage: dev                                                  │      │
│          │ spec:                                                           │      │
│          │   replicas: 1                                                   │      │
│          │   selector:                                                     │      │
│          │     matchLabels:                                                │      │
│          │       app: db                                                   │      │
│          │   template:                                                     │      │
│          │     metadata:                                                   │      │
│          │       creationTimestamp: null                                   │      │
│          │       labels:                                                   │      │
│          │         app: db                                                 │      │
│          │     spec:                                                       │      │
│          │       containers:                                               │      │
│          │         - name: postgres                                        │      │
│          │           image: postgres:10-alpine                             │      │
│          │           ports:                                                │      │
│          │             - name: postgres                                    │      │
│          │               containerPort: 5432                               │      │
│          │               protocol: TCP                                     │      │
│          │           env:                                                  │      │
│          │             - name: POSTGRES_USER                               │      │
│          │               valueFrom:                                        │      │
│          │                 configMapKeyRef:                                │      │
│          │                   name: postgres                                │      │
│          │                   key: POSTGRES_USER                            │      │
│          │             - name: POSTGRES_PASSWORD                           │      │
│          │               valueFrom:                                        │      │
│          │                 configMapKeyRef:                                │      │
│          │                   name: postgres                                │      │
│          │                   key: POSTGRES_PASSWORD                        │      │
│          │             - name: POSTGRES_DB                                 │      │
│          │               valueFrom:                                        │      │
│          │                 configMapKeyRef:                                │      │
│          │                   name: postgres                                │      │
│          │                   key: POSTGRES_DB                              │      │
│          │           resources:                                            │      │
│          │           volumeMounts:                                         │      │
│          │             - name: pv-db                                       │      │
│          │               mountPath: /var/lib/postgresql                    │      │
│          │           terminationMessagePath: /dev/termination-log          │      │
│          │           terminationMessagePolicy: File                        │      │
│          │           imagePullPolicy: IfNotPresent                         │      │
│          │       restartPolicy: Always                                     │      │
│          │       terminationGracePeriodSeconds: 30                         │      │
│          │       dnsPolicy: ClusterFirst                                   │      │
│          │       securityContext:                                          │      │
│          │       schedulerName: default-scheduler                          │      │
│          │   volumeClaimTemplates:                                         │      │
│          │     - kind: PersistentVolumeClaim                               │      │
│          │       apiVersion: v1                                            │      │
│          │       metadata:                                                 │      │
│          │         name: pv-db                                             │      │
│          │         creationTimestamp: null                                 │      │
│          │       spec:                                                     │      │
│          │         accessModes:                                            │      │
│          │           - "ReadWriteOnce"                                     │      │
│          │         resources:                                              │      │
│          │           requests:                                             │      │
│          │             storage: 1Gi                                        │      │
│          │         volumeMode: Filesystem                                  │      │
│          │       status:                                                   │      │
│          │         phase: Pending                                          │      │
│          │   serviceName: postgres                                         │      │
│          │   podManagementPolicy: OrderedReady                             │      │
│          │   updateStrategy:                                               │      │
│          │     type: RollingUpdate                                         │      │
│          │     rollingUpdate:                                              │      │
│          │       partition: 0                                              │      │
│          │   revisionHistoryLimit: 10                                      │      │
│          │ status:                                                         │      │
│          │   observedGeneration: 1                                         │      │
│          │   replicas: 1                                                   │      │
│          │   readyReplicas: 1                                              │      │
│          │   currentReplicas: 1                                            │      │
│          │   updatedReplicas: 1                                            │      │
│          │   currentRevision: postgres-765dc6b644                          │      │
│          │   updateRevision: postgres-765dc6b644                           │      │
│          │   collisionCount: 0                                             │      │
│          │                                                                 │      │
└──────────┴─────────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
└──────────────────────────────────────────────────────────────────────────────────┘
Provider: k8s
┌──────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                              │
├────────────────────┬─────────────────────────────────────────────────────────────┤
│ StatefulSet        │ postgres                                                    │
└────────────────────┴─────────────────────────────────────────────────────────────┘
1 resource, 1 type, 2 providers
Command "gc l -t StatefulSet -n postgres" executed in 4s
```
