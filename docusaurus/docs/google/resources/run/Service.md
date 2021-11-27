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
