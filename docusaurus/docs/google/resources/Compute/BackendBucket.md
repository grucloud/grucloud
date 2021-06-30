---
id: BackendBucket
title: Backend Bucket
---

Provides a backend bucket.

```js
const bucketName = "myfancybucketname";

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
```

### Examples

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https/iac.js#L7)

### Properties

- [all properties](https://cloud.google.com/compute/docs/reference/rest/v1/backendBuckets/insert)

### Used By

- [UrlMap](./UrlMap.md)

## List

List all Backend Buckets with the **BackendBucket** type

```sh
gc l -t BackendBucket
```

```txt
Listing resources on 1 provider: google
✓ google
  ✓ Initialising
  ✓ Listing 1/1
┌────────────────────────────────────────────────────────────────────────────────┐
│ 1 BackendBucket from google                                                    │
├────────────────┬────────────────────────────────────────────────────────┬──────┤
│ Name           │ Data                                                   │ Our  │
├────────────────┼────────────────────────────────────────────────────────┼──────┤
│ backend-bucket │ id: 8720064536531564011                                │ Yes  │
│                │ creationTimestamp: 2021-06-30T03:44:20.676-07:00       │      │
│                │ name: backend-bucket                                   │      │
│                │ description: Managed By GruCloud                       │      │
│                │ selfLink: https://www.googleapis.com/compute/v1/proje… │      │
│                │ bucketName: grucloud.org                               │      │
│                │ enableCdn: false                                       │      │
│                │ kind: compute#backendBucket                            │      │
│                │                                                        │      │
└────────────────┴────────────────────────────────────────────────────────┴──────┘

List Summary:
Provider: google
┌───────────────────────────────────────────────────────────────────────────────┐
│ google                                                                        │
├────────────────────┬──────────────────────────────────────────────────────────┤
│ BackendBucket      │ backend-bucket                                           │
└────────────────────┴──────────────────────────────────────────────────────────┘
1 resource, 1 type, 1 provider
Command "gc l -t BackendBucket" executed in 3s
```
