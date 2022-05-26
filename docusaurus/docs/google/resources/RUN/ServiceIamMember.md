---
id: ServiceIamMember
title: Service Iam Member
---

Provides a [Cloud Run Service Iam Member](https://console.cloud.google.com/run):

```js
provider.run.makeServiceIamMember({
  properties: ({ config }) => ({
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
  dependencies: ({}) => ({
    service: "starhackit-server",
  }),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/run/run-hello-nodejs/resources.js)

### Properties

- [all properties](https://cloud.google.com/run/docs/reference/rest/v1/projects.locations.services/setIamPolicy)

### Dependencies

- [Service](./Service.md)

## List

List all cloud run service iam member with the **ServiceIamMember** type

```sh
gc l -t ServiceIamMember
```

```txt
Listing resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 2/2
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│ 1 run::ServiceIamMember from google                                                               │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ name: starhackit-server::us-central1                                                              │
│ managedByUs: Yes                                                                                  │
│ live:                                                                                             │
│   service: starhackit-server                                                                      │
│   location: us-central1                                                                           │
│   policy:                                                                                         │
│     version: 1                                                                                    │
│     etag: BwXSct3XZdQ=                                                                            │
│     bindings:                                                                                     │
│       - role: roles/run.invoker                                                                   │
│         members:                                                                                  │
│           - "allUsers"                                                                            │
│                                                                                                   │
└───────────────────────────────────────────────────────────────────────────────────────────────────┘


List Summary:
Provider: google
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ google                                                                                           │
├───────────────────────┬──────────────────────────────────────────────────────────────────────────┤
│ run::ServiceIamMember │ starhackit-server::us-central1                                           │
└───────────────────────┴──────────────────────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t ServiceIamMember" executed in 3s
```
