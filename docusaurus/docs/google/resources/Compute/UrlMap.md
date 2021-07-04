---
id: UrlMap
title: Url Map
---

Provides a [URL Map](https://console.cloud.google.com/net-services/loadbalancing/loadBalancers/list) used by the HTTPS load balancer

### Code

```js
const bucketName = "mybucketname";

const myBucket = provider.storage.makeBucket({
  name: bucketName,
  properties: () => ({}),
});

const backendBucket = provider.compute.makeBackendBucket({
  name: "backend-bucket",
  properties: () => ({
    bucketName,
  }),
});

const urlMap = provider.compute.makeUrlMap({
  name: "url-map",
  dependencies: { service: backendBucket },
  properties: () => ({}),
});
```

### Examples

- [Https Website](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https)

![website-https/diagram-target.svg](https://raw.githubusercontent.com/grucloud/grucloud/main/examples/google/storage/website-https/diagram-target.svg)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/urlMaps/insert)

### Dependencies

- [BackendBucket](./BackendBucket.md)

### Used By

- [HttpsTargetProxy](./HttpsTargetProxy.md)

## List

List all Url Maps with the **UrlMap** type

```sh
gc l -t UrlMap
```

```txt
Listing resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 2/2
┌────────────────────────────────────────────────────────────────────────────────┐
│ 1 UrlMap from google                                                           │
├──────────┬──────────────────────────────────────────────────────────────┬──────┤
│ Name     │ Data                                                         │ Our  │
├──────────┼──────────────────────────────────────────────────────────────┼──────┤
│ url-map  │ id: 1187115894224057828                                      │ Yes  │
│          │ creationTimestamp: 2021-06-30T03:44:27.793-07:00             │      │
│          │ name: url-map                                                │      │
│          │ description: Managed By GruCloud                             │      │
│          │ selfLink: https://www.googleapis.com/compute/v1/projects/gr… │      │
│          │ defaultService: https://www.googleapis.com/compute/v1/proje… │      │
│          │ fingerprint: AFWyLkZ6QVA=                                    │      │
│          │ kind: compute#urlMap                                         │      │
│          │                                                              │      │
└──────────┴──────────────────────────────────────────────────────────────┴──────┘


List Summary:
Provider: google
┌───────────────────────────────────────────────────────────────────────────────┐
│ google                                                                        │
├────────────────────┬──────────────────────────────────────────────────────────┤
│ UrlMap             │ url-map                                                  │
└────────────────────┴──────────────────────────────────────────────────────────┘
1 resource, 2 types, 1 provider
Command "gc l -t UrlMap" executed in 3s
```
