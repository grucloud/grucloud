---
id: Service
title: Service
---

Provides a [Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/)

## Examples

### Create a NodePort service for a Deployment

This example creates a NodePort service for use with a Deployment:

```js
const appLabel = "myLabel";

const namespace = provider.makeNamespace({
  name: "myNamespace",
});

const service = provider.makeService({
  name: "myService",
  dependencies: { namespace },
  properties: () => ({
    spec: {
      selector: {
        app: appLabel,
      },
      type: "NodePort",
      ports: [
        {
          protocol: "TCP",
          port: 80,
          targetPort: 8080,
        },
      ],
    },
  }),
});
```

### Create a Headless Service for a StatefulSet

This example creates a Headless service for use with a StatefulSet:

```js
const appLabel = "db";

const namespace = provider.makeNamespace({
  name: "myNamespace",
});

const service = provider.makeService({
  name: "postgres-service",
  dependencies: { namespace },
  properties: () => ({
    spec: {
      selector: {
        app: appLabel,
      },
      clusterIP: "None", // Headless service
      ports: [
        {
          protocol: "TCP",
          port: "5432",
          targetPort: "5432",
        },
      ],
    },
  }),
});
```

## Source Code Examples

- [NodePort service for rest server](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/charts/rest-server.js#L129)

- [Headless service for postgres](https://github.com/grucloud/grucloud/blob/main/examples/k8s/starhackit/base/charts/postgres.js#L144)

## Listing

The following command lists only the **Service** type and services created by GruCloud:

```sh
gc l -t Service --our
```

```sh
Listing resources on 2 providers: aws, k8s
✓ aws
  ✓ Initialising
  ✓ Listing
✓ k8s
  ✓ Initialising
  ✓ Listing 3/3
┌───────────────────────────────────────────────────────────────────────────────────┐
│ 7 Service from k8s                                                                │
├───────────────────────────────────┬────────────────────────────────────────┬──────┤
│ Name                              │ Data                                   │ Our  │
├───────────────────────────────────┼────────────────────────────────────────┼──────┤
│ cert-manager                      │ metadata:                              │ Yes  │
│                                   │   name: cert-manager                   │      │
│                                   │   namespace: cert-manager              │      │
│                                   │   selfLink: /api/v1/namespaces/cert-m… │      │
│                                   │   uid: a6d32acc-800d-4f3a-8b67-d4e222… │      │
│                                   │   resourceVersion: 117972              │      │
│                                   │   creationTimestamp: 2021-03-23T15:36… │      │
│                                   │   labels:                              │      │
│                                   │     app: cert-manager                  │      │
│                                   │     app.kubernetes.io/component: cont… │      │
│                                   │     app.kubernetes.io/instance: cert-… │      │
│                                   │     app.kubernetes.io/name: cert-mana… │      │
│                                   │   annotations:                         │      │
│                                   │     CreatedByProvider: k8s             │      │
│                                   │     ManagedBy: GruCloud                │      │
│                                   │     Name: cert-manager                 │      │
│                                   │     stage: dev                         │      │
│                                   │ spec:                                  │      │
│                                   │   ports:                               │      │
│                                   │     - protocol: TCP                    │      │
│                                   │       port: 9402                       │      │
│                                   │       targetPort: 9402                 │      │
│                                   │   selector:                            │      │
│                                   │     app.kubernetes.io/component: cont… │      │
│                                   │     app.kubernetes.io/instance: cert-… │      │
│                                   │     app.kubernetes.io/name: cert-mana… │      │
│                                   │   clusterIP: 10.100.5.226              │      │
│                                   │   type: ClusterIP                      │      │
│                                   │   sessionAffinity: None                │      │
│                                   │ status:                                │      │
│                                   │   loadBalancer:                        │      │
│                                   │                                        │      │
├───────────────────────────────────┼────────────────────────────────────────┼──────┤
```
