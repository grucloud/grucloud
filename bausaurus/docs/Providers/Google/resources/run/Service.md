---
id: Service
title: Service
---

Provides a [Cloud Run Service](https://console.cloud.google.com/run):

```js
provider.run.makeService({
  properties: ({ config }) => ({
    apiVersion: "serving.knative.dev/v1",
    kind: "Service",
    metadata: {
      name: "starhackit-server",
    },
    spec: {
      template: {
        metadata: {
          name: "starhackit-server-00005-rud",
          annotations: {
            "autoscaling.knative.dev/maxScale": "100",
          },
        },
        spec: {
          containerConcurrency: 80,
          timeoutSeconds: 300,
          serviceAccountName: `${config.projectNumber()}-compute@developer.gserviceaccount.com`,
          containers: [
            {
              image: "gcr.io/google-samples/hello-app:1.0",
              resources: {
                limits: {
                  cpu: "2000m",
                  memory: "512Mi",
                },
              },
              ports: [
                {
                  name: "http1",
                  containerPort: 8080,
                },
              ],
            },
          ],
        },
      },
      traffic: [
        {
          percent: 100,
          latestRevision: true,
        },
      ],
    },
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/run/run-hello-nodejs/resources.js)

### Properties

- [all properties](https://cloud.google.com/run/docs/reference/rest/v1/namespaces.services#Service)

### Used By

- [Service Iam Member](./ServiceIamMember.md)

## List

List all cloud run services with the **run::Service** type

```sh
gc l -t run::Service
```

```txt
Listing resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 1/1
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 run::Service from google                                                                        │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: starhackit-server                                                                           │
│ managedByUs: Yes                                                                                  │
│ live:                                                                                             │
│   apiVersion: serving.knative.dev/v1                                                              │
│   kind: Service                                                                                   │
│   metadata:                                                                                       │
│     name: starhackit-server                                                                       │
│     namespace: 91170824493                                                                        │
│     selfLink: /apis/serving.knative.dev/v1/namespaces/91170824493/services/starhackit-server      │
│     uid: b5eddd26-9ba7-4e9b-a9ef-7d31d60e89b6                                                     │
│     resourceVersion: AAXSct2QUIs                                                                  │
│     generation: 1                                                                                 │
│     labels:                                                                                       │
│       cloud.googleapis.com/location: us-central1                                                  │
│     annotations:                                                                                  │
│       serving.knative.dev/creator: grucloud@grucloud-test.iam.gserviceaccount.com                 │
│       serving.knative.dev/lastModifier: grucloud@grucloud-test.iam.gserviceaccount.com            │
│       run.googleapis.com/ingress: all                                                             │
│       run.googleapis.com/ingress-status: all                                                      │
│     creationTimestamp: 2021-12-06T04:41:00.634657Z                                                │
│   spec:                                                                                           │
│     template:                                                                                     │
│       metadata:                                                                                   │
│         name: starhackit-server-00005-rud                                                         │
│         annotations:                                                                              │
│           autoscaling.knative.dev/maxScale: 100                                                   │
│       spec:                                                                                       │
│         containerConcurrency: 80                                                                  │
│         timeoutSeconds: 300                                                                       │
│         serviceAccountName: 91170824493-compute@developer.gserviceaccount.com                     │
│         containers:                                                                               │
│           - image: gcr.io/google-samples/hello-app:1.0                                            │
│             resources:                                                                            │
│               limits:                                                                             │
│                 cpu: 2000m                                                                        │
│                 memory: 512Mi                                                                     │
│             ports:                                                                                │
│               - name: http1                                                                       │
│                 containerPort: 8080                                                               │
│     traffic:                                                                                      │
│       - percent: 100                                                                              │
│         latestRevision: true                                                                      │
│   status:                                                                                         │
│     observedGeneration: 1                                                                         │
│     conditions:                                                                                   │
│       - type: Ready                                                                               │
│         status: True                                                                              │
│         lastTransitionTime: 2021-12-06T04:41:08.880523Z                                           │
│       - type: ConfigurationsReady                                                                 │
│         status: True                                                                              │
│         lastTransitionTime: 2021-12-06T04:41:08.049687Z                                           │
│       - type: RoutesReady                                                                         │
│         status: True                                                                              │
│         lastTransitionTime: 2021-12-06T04:41:08.880523Z                                           │
│     latestReadyRevisionName: starhackit-server-00005-rud                                          │
│     latestCreatedRevisionName: starhackit-server-00005-rud                                        │
│     traffic:                                                                                      │
│       - revisionName: starhackit-server-00005-rud                                                 │
│         percent: 100                                                                              │
│         latestRevision: true                                                                      │
│     url: https://starhackit-server-dbxubuk5wa-uc.a.run.app                                        │
│     address:                                                                                      │
│       url: https://starhackit-server-dbxubuk5wa-uc.a.run.app                                      │
│                                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: google
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ google                                                                                           │
├──────────────┬───────────────────────────────────────────────────────────────────────────────────┤
│ run::Service │ starhackit-server                                                                 │
└──────────────┴───────────────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t run::Service" executed in 2s
```
