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

### Static Website Bucket

```js
const bucketPublic = await provider.makeBucket({
  name: "demo.yourwebite.com",
  properties: () => ({
    iamConfiguration: {
      uniformBucketLevelAccess: {
        enabled: true,
      },
    },
    iam: {
      bindings: [
        {
          role: "roles/storage.objectViewer",
          members: ["allUsers"],
        },
      ],
    },
    website: { mainPageSuffix: "index.html", notFoundPage: "404.html" },
  }),
});
```

## Example Code

- [basic example](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/simple/iac.js#L7)
- [https static website](https://github.com/grucloud/grucloud/blob/main/examples/google/storage/website-https/iac.js#L7)

## Properties

See [Bucket create properties](https://cloud.google.com/storage/docs/json_api/v1/buckets/insert#request-body)

## Used By

- [GcpObject](./GcpObject)
