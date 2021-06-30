---
id: UrlMap
title: Url Map
---

Provides a URL Map used by the HTTPS load balancer.

```js
const bucketName = "mybucketname";

const myBucket = await provider.makeBucket({
  name: bucketName,
  properties: () => ({}),
});

const backendBucket = await provider.makeBackendBucket({
  name: "backend-bucket",
  properties: () => ({
    bucketName,
  }),
});

const urlMap = await provider.makeUrlMap({
  name: "url-map",
  dependencies: { service: backendBucket },
  properties: () => ({}),
});
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https/iac.js#L7)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/urlMaps/insert)

## Dependencies

- [BackendBucket](./BackendBucket.md)

## Used By

- [HttpsTargetProxy](./HttpsTargetProxy.md)

## GCloud docs

- [Url Map concepts](https://cloud.google.com/load-balancing/docs/url-map-concepts)

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
