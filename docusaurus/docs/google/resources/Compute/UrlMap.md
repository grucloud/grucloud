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

- [HttpTargetProxy](./HttpTargetProxy.md)
