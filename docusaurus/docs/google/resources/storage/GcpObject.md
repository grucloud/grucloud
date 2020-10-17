---
id: GcpObject
title: Object
---

Provides an Object storage.

## Examples

### Simple Object

```js
const bucket = await provider.makeBucket({
  name: "myuniquebucketname",
  properties: () => ({ storageClass: "STANDARD" }),
});

const Object = await provider.makeObject({
  name: "myname",
  dependencies: { bucket: bucket },
  properties: () => ({
    path: "/",
    contentType: "text/plain",
    source: path.join(process.cwd(), "testFile.txt"),
  }),
});
```

### Properties

See [Object create properties](https://cloud.google.com/storage/docs/json_api/v1/objects/insert#request-body)

### Example Code

- [basic example](https://github.com/grucloud/grucloud/blob/master/examples/google/storage/simple/iac.js#L7)

## Depends On

- [GcpBucket](./GcpBucket)
