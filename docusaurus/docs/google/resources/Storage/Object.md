---
id: Object
title: Object
---

Provides an Object storage.

## Examples

### Simple Object

```js
provider.storage.makeBucket({
  name: "myuniquebucketname",
  properties: () => ({ storageClass: "STANDARD" }),
});

provider.storage.makeObject({
  name: "myname",
  dependencies: { bucket: "myuniquebucketname" },
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

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/simple)

## Depends On

- [GcpBucket](./Bucket.md)
