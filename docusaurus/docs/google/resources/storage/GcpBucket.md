---
id: GcpBucket
title: Bucket
---

Provides a bucket storage for a project.

## Examples

### Simple Bucket

```js
const bucket = await provider.makeBucket({
  name: "myuniquebucketname",
  properties: () => ({ storageClass: "STANDARD" }),
});
```

### Example Code

- [basic example](https://github.com/grucloud/grucloud/blob/master/examples/google/storage/simple/iac.js#L7)

## Properties

See [Bucket create properties](https://cloud.google.com/storage/docs/json_api/v1/buckets/insert#request-body)

## Used By

- [GcpObject](./GcpObject)
