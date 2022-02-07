---
id: Bucket
title: Bucket
---

Provides a [bucket storage](https://console.cloud.google.com/storage/browser/) for a project.

## Examples

### Simple Bucket

```js
provider.storage.makeBucket({
  name: "myuniquebucketname",
  properties: () => ({ storageClass: "STANDARD" }),
});
```

### Static Website Bucket

```js
provider.storage.makeBucket({
  name: "demo.yourwebsite.com",
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

- [GcpObject](./Object.md)
