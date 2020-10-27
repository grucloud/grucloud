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
