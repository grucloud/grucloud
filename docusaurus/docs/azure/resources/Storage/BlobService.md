---
id: BlobService
title: BlobService
---
Provides a **BlobService** from the **Storage** group
## Examples
### PutBlobServices
```js
provider.Storage.makeBlobService({
  name: "myBlobService",
  properties: () => ({
    properties: {
      cors: {
        corsRules: [
          {
            allowedOrigins: [
              "http://www.contoso.com",
              "http://www.fabrikam.com",
            ],
            allowedMethods: ["GET", "HEAD", "POST", "OPTIONS", "MERGE", "PUT"],
            maxAgeInSeconds: 100,
            exposedHeaders: ["x-ms-meta-*"],
            allowedHeaders: [
              "x-ms-meta-abc",
              "x-ms-meta-data*",
              "x-ms-meta-target*",
            ],
          },
          {
            allowedOrigins: ["*"],
            allowedMethods: ["GET"],
            maxAgeInSeconds: 2,
            exposedHeaders: ["*"],
            allowedHeaders: ["*"],
          },
          {
            allowedOrigins: [
              "http://www.abc23.com",
              "https://www.fabrikam.com/*",
            ],
            allowedMethods: ["GET", "PUT"],
            maxAgeInSeconds: 2000,
            exposedHeaders: [
              "x-ms-meta-abc",
              "x-ms-meta-data*",
              "x -ms-meta-target*",
            ],
            allowedHeaders: ["x-ms-meta-12345675754564*"],
          },
        ],
      },
      defaultServiceVersion: "2017-07-29",
      deleteRetentionPolicy: { enabled: true, days: 300 },
      isVersioningEnabled: true,
      changeFeed: { enabled: true, retentionInDays: 7 },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```

### BlobServicesPutLastAccessTimeBasedTracking
```js
provider.Storage.makeBlobService({
  name: "myBlobService",
  properties: () => ({
    properties: {
      lastAccessTimeTrackingPolicy: {
        enable: true,
        name: "AccessTimeTracking",
        trackingGranularityInDays: 1,
        blobType: ["blockBlob"],
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    account: resources.Storage.StorageAccount["myStorageAccount"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StorageAccount](../Storage/StorageAccount.md)
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-06-01/blob.json).
