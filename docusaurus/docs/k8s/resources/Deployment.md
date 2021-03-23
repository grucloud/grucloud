---
id: Deployment
title: Deployment
---

Provides a [Kubernetes Deployment](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/).

## Examples

### Create a deployment for nginx

```js
const labelApp = "myApp";

const namespace = await provider.makeNamespace({
  name: "myNamespace",
});

const deployment = await provider.makeDeployment({
  name: "myDeployment",
  dependencies: { namespace },
  properties: ({}) => ({
    metadata: {
      labels: {
        app: labelApp,
      },
    },
    spec: {
      replicas: 3,
      selector: {
        matchLabels: {
          app: labelApp,
        },
      },
      template: {
        metadata: {
          labels: {
            app: labelApp,
          },
        },
        spec: {
          containers: [
            {
              name: "nginx",
              image: "nginx:1.14.2",
              ports: [
                {
                  containerPort: 80,
                },
              ],
            },
          ],
        },
      },
    },
  }),
});
```

## Source Code Examples

- [web server](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/charts/web-server.js#L56)
- [rest server](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/charts/rest-server.js#L111)

## Dependencies

- [Namespace](./Namespace)

## Listing

The following commands list the **Deployment** type:

```sh
gc list --types Deployment
```

Short version:

```sh
gc l -t Dep
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
│ Deployment         │ cert-manager                                                │
│                    │ cert-manager-cainjector                                     │
│                    │ cert-manager-webhook                                        │
│                    │ rest                                                        │
│                    │ web                                                         │
│                    │ aws-load-balancer-controller                                │
│                    │ coredns                                                     │
└────────────────────┴─────────────────────────────────────────────────────────────┘
7 resources, 1 type, 2 providers
Command "gc list --types Deployment" executed in 5s

```

To inquire about a specific deployment:

```sh
gc l -t Dep -n aws-load-balancer-controller
```

```sh
Listing resources on 2 providers: aws, k8s
✓ aws
  ✓ Initialising
  ✓ Listing
✓ k8s
  ✓ Initialising
  ✓ Listing 6/6
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 1 Deployment from k8s                                                             │
├──────────────────────────────┬─────────────────────────────────────────────┬──────┤
│ Name                         │ Data                                        │ Our  │
├──────────────────────────────┼─────────────────────────────────────────────┼──────┤
│ aws-load-balancer-controller │ metadata:                                   │ Yes  │
│                              │   name: aws-load-balancer-controller        │      │
│                              │   namespace: kube-system                    │      │
│                              │   selfLink: /apis/apps/v1/namespaces/kube-… │      │
│                              │   uid: 7c525208-5787-47fe-8f5f-fa8865d9a256 │      │
│                              │   resourceVersion: 133066                   │      │
│                              │   generation: 1                             │      │
│                              │   creationTimestamp: 2021-03-23T16:33:39Z   │      │
│                              │   labels:                                   │      │
│                              │     app.kubernetes.io/component: controller │      │
│                              │     app.kubernetes.io/name: aws-load-balan… │      │
│                              │   annotations:                              │      │
│                              │     CreatedByProvider: k8s                  │      │
│                              │     ManagedBy: GruCloud                     │      │
│                              │     Name: aws-load-balancer-controller      │      │
│                              │     deployment.kubernetes.io/revision: 1    │      │
│                              │     stage: dev                              │      │
│                              │ spec:                                       │      │
│                              │   replicas: 1                               │      │
│                              │   selector:                                 │      │
│                              │     matchLabels:                            │      │
│                              │       app.kubernetes.io/component: control… │      │
│                              │       app.kubernetes.io/name: aws-load-bal… │      │
│                              │   template:                                 │      │
│                              │     metadata:                               │      │
│                              │       creationTimestamp: null               │      │
│                              │       labels:                               │      │
│                              │         app.kubernetes.io/component: contr… │      │
│                              │         app.kubernetes.io/name: aws-load-b… │      │
│                              │     spec:                                   │      │
│                              │       volumes:                              │      │
│                              │         - name: cert                        │      │
│                              │           secret:                           │      │
│                              │             secretName: aws-load-balancer-… │      │
│                              │             defaultMode: 420                │      │
│                              │       containers:                           │      │
│                              │         - name: controller                  │      │
│                              │           image: amazon/aws-alb-ingress-co… │      │
│                              │           args:                             │      │
│                              │             - "--cluster-name=cluster"      │      │
│                              │             - "--ingress-class=alb"         │      │
│                              │           ports:                            │      │
│                              │             - name: webhook-server          │      │
│                              │               containerPort: 9443           │      │
│                              │               protocol: TCP                 │      │
│                              │           resources:                        │      │
│                              │             limits:                         │      │
│                              │               cpu: 200m                     │      │
│                              │               memory: 500Mi                 │      │
│                              │             requests:                       │      │
│                              │               cpu: 100m                     │      │
│                              │               memory: 200Mi                 │      │
│                              │           volumeMounts:                     │      │
│                              │             - name: cert                    │      │
│                              │               readOnly: true                │      │
│                              │               mountPath: /tmp/k8s-webhook-… │      │
│                              │           livenessProbe:                    │      │
│                              │             httpGet:                        │      │
│                              │               path: /healthz                │      │
│                              │               port: 61779                   │      │
│                              │               scheme: HTTP                  │      │
│                              │             initialDelaySeconds: 30         │      │
│                              │             timeoutSeconds: 10              │      │
│                              │             periodSeconds: 10               │      │
│                              │             successThreshold: 1             │      │
│                              │             failureThreshold: 2             │      │
│                              │           terminationMessagePath: /dev/ter… │      │
│                              │           terminationMessagePolicy: File    │      │
│                              │           imagePullPolicy: IfNotPresent     │      │
│                              │           securityContext:                  │      │
│                              │             runAsNonRoot: true              │      │
│                              │             readOnlyRootFilesystem: true    │      │
│                              │             allowPrivilegeEscalation: false │      │
│                              │       restartPolicy: Always                 │      │
│                              │       terminationGracePeriodSeconds: 10     │      │
│                              │       dnsPolicy: ClusterFirst               │      │
│                              │       serviceAccountName: aws-load-balance… │      │
│                              │       serviceAccount: aws-load-balancer-co… │      │
│                              │       securityContext:                      │      │
│                              │         fsGroup: 1337                       │      │
│                              │       schedulerName: default-scheduler      │      │
│                              │   strategy:                                 │      │
│                              │     type: RollingUpdate                     │      │
│                              │     rollingUpdate:                          │      │
│                              │       maxUnavailable: 25%                   │      │
│                              │       maxSurge: 25%                         │      │
│                              │   revisionHistoryLimit: 10                  │      │
│                              │   progressDeadlineSeconds: 600              │      │
│                              │ status:                                     │      │
│                              │   observedGeneration: 1                     │      │
│                              │   replicas: 1                               │      │
│                              │   updatedReplicas: 1                        │      │
│                              │   readyReplicas: 1                          │      │
│                              │   availableReplicas: 1                      │      │
│                              │   conditions:                               │      │
│                              │     - type: Available                       │      │
│                              │       status: True                          │      │
│                              │       lastUpdateTime: 2021-03-23T16:33:42Z  │      │
│                              │       lastTransitionTime: 2021-03-23T16:33… │      │
│                              │       reason: MinimumReplicasAvailable      │      │
│                              │       message: Deployment has minimum avai… │      │
│                              │     - type: Progressing                     │      │
│                              │       status: True                          │      │
│                              │       lastUpdateTime: 2021-03-23T16:33:42Z  │      │
│                              │       lastTransitionTime: 2021-03-23T16:33… │      │
│                              │       reason: NewReplicaSetAvailable        │      │
│                              │       message: ReplicaSet    aws-load-balan │      │
│                              │                                             │      │
└──────────────────────────────┴─────────────────────────────────────────────┴──────┘


List Summary:
Provider: aws
┌──────────────────────────────────────────────────────────────────────────────────┐
│ aws                                                                              │
└──────────────────────────────────────────────────────────────────────────────────┘
Provider: k8s
┌──────────────────────────────────────────────────────────────────────────────────┐
│ k8s                                                                              │
├────────────────────┬─────────────────────────────────────────────────────────────┤
│ Deployment         │ aws-load-balancer-controller                                │
└────────────────────┴─────────────────────────────────────────────────────────────┘
1 resource, 1 type, 2 providers
Command "gc l -t Dep -n aws-load-balancer-controller" executed in 7s
```
