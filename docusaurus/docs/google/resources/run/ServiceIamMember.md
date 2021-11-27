---
id: ServiceIamMember
title: Service Iam Member
---

Provides a [Cloud Run Service Iam Member](https://console.cloud.google.com/run):

```js
provider.run.makeServiceIamMember({
  properties: ({ config }) => ({
    service: "starhackit-server",
    location: config.region,
    policy: {
      version: 1,
      bindings: [
        {
          role: "roles/run.invoker",
          members: ["allUsers"],
        },
      ],
    },
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/run/run-hello-nodejs/resources.js)

### Properties

- [all properties](https://cloud.google.com/run/docs/reference/rest/v1/projects.locations.services/setIamPolicy)

### Dependencies

- [Service](./Service.md)
