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
## Swagger Schema
```js
{
  properties: {
    properties: {
      properties: {
        cors: {
          description: 'Specifies CORS rules for the Blob service. You can include up to five CorsRule elements in the request. If no CorsRule elements are included in the request body, all CORS rules will be deleted, and CORS will be disabled for the Blob service.',
          properties: {
            corsRules: {
              type: 'array',
              items: {
                description: 'Specifies a CORS rule for the Blob service. ',
                properties: {
                  allowedOrigins: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Required if CorsRule element is present. A list of origin domains that will be allowed via CORS, or "*" to allow all domains'
                  },
                  allowedMethods: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: [
                        'DELETE', 'GET',
                        'HEAD',   'MERGE',
                        'POST',   'OPTIONS',
                        'PUT'
                      ]
                    },
                    description: 'Required if CorsRule element is present. A list of HTTP methods that are allowed to be executed by the origin.'
                  },
                  maxAgeInSeconds: {
                    type: 'integer',
                    description: 'Required if CorsRule element is present. The number of seconds that the client/browser should cache a preflight response.'
                  },
                  exposedHeaders: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Required if CorsRule element is present. A list of response headers to expose to CORS clients.'
                  },
                  allowedHeaders: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Required if CorsRule element is present. A list of headers allowed to be part of the cross-origin request.'
                  }
                },
                required: [
                  'allowedOrigins',
                  'allowedMethods',
                  'maxAgeInSeconds',
                  'exposedHeaders',
                  'allowedHeaders'
                ]
              },
              description: 'The List of CORS rules. You can include up to five CorsRule elements in the request. '
            }
          }
        },
        defaultServiceVersion: {
          type: 'string',
          description: 'DefaultServiceVersion indicates the default version to use for requests to the Blob service if an incoming request’s version is not specified. Possible values include version 2008-10-27 and all more recent versions.'
        },
        deleteRetentionPolicy: {
          description: 'The blob service properties for blob soft delete.',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Indicates whether DeleteRetentionPolicy is enabled.'
            },
            days: {
              type: 'integer',
              minimum: 1,
              maximum: 365,
              description: 'Indicates the number of days that the deleted item should be retained. The minimum specified value can be 1 and the maximum value can be 365.'
            }
          }
        },
        isVersioningEnabled: {
          type: 'boolean',
          description: 'Versioning is enabled if set to true.'
        },
        automaticSnapshotPolicyEnabled: {
          type: 'boolean',
          description: 'Deprecated in favor of isVersioningEnabled property.'
        },
        changeFeed: {
          description: 'The blob service properties for change feed events.',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Indicates whether change feed event logging is enabled for the Blob service.'
            },
            retentionInDays: {
              type: 'integer',
              minimum: 1,
              maximum: 146000,
              format: 'int32',
              description: 'Indicates the duration of changeFeed retention in days. Minimum value is 1 day and maximum value is 146000 days (400 years). A null value indicates an infinite retention of the change feed.'
            }
          }
        },
        restorePolicy: {
          description: 'The blob service properties for blob restore policy.',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Blob restore is enabled if set to true.'
            },
            days: {
              type: 'integer',
              minimum: 1,
              maximum: 365,
              description: 'how long this blob can be restored. It should be great than zero and less than DeleteRetentionPolicy.days.'
            },
            lastEnabledTime: {
              type: 'string',
              format: 'date-time',
              readOnly: true,
              description: 'Deprecated in favor of minRestoreTime property.'
            },
            minRestoreTime: {
              type: 'string',
              format: 'date-time',
              readOnly: true,
              description: 'Returns the minimum date and time that the restore can be started.'
            }
          },
          required: [ 'enabled' ]
        },
        containerDeleteRetentionPolicy: {
          description: 'The blob service properties for container soft delete.',
          properties: {
            enabled: {
              type: 'boolean',
              description: 'Indicates whether DeleteRetentionPolicy is enabled.'
            },
            days: {
              type: 'integer',
              minimum: 1,
              maximum: 365,
              description: 'Indicates the number of days that the deleted item should be retained. The minimum specified value can be 1 and the maximum value can be 365.'
            }
          }
        },
        lastAccessTimeTrackingPolicy: {
          description: 'The blob service property to configure last access time based tracking policy.',
          properties: {
            enable: {
              type: 'boolean',
              description: 'When set to true last access time based tracking is enabled.'
            },
            name: {
              type: 'string',
              description: 'Name of the policy. The valid value is AccessTimeTracking. This field is currently read only',
              enum: [ 'AccessTimeTracking' ],
              'x-ms-enum': { name: 'name', modelAsString: true }
            },
            trackingGranularityInDays: {
              type: 'integer',
              format: 'int32',
              description: 'The field specifies blob object tracking granularity in days, typically how often the blob object should be tracked.This field is currently read only with value as 1'
            },
            blobType: {
              type: 'array',
              items: { type: 'string' },
              description: 'An array of predefined supported blob types. Only blockBlob is the supported value. This field is currently read only'
            }
          },
          required: [ 'enable' ]
        }
      },
      'x-ms-client-flatten': true,
      'x-ms-client-name': 'BlobServiceProperties',
      description: 'The properties of a storage account’s Blob service.'
    },
    sku: {
      readOnly: true,
      description: 'Sku name and tier.',
      properties: {
        name: {
          type: 'string',
          description: 'The SKU name. Required for account creation; optional for update. Note that in older versions, SKU name was called accountType.',
          enum: [
            'Standard_LRS',
            'Standard_GRS',
            'Standard_RAGRS',
            'Standard_ZRS',
            'Premium_LRS',
            'Premium_ZRS',
            'Standard_GZRS',
            'Standard_RAGZRS'
          ],
          'x-ms-enum': { name: 'SkuName', modelAsString: true }
        },
        tier: {
          readOnly: true,
          type: 'string',
          description: 'The SKU tier. This is based on the SKU name.',
          enum: [ 'Standard', 'Premium' ],
          'x-ms-enum': { name: 'SkuTier', modelAsString: false }
        }
      },
      required: [ 'name' ]
    }
  },
  allOf: [
    {
      title: 'Resource',
      description: 'Common fields that are returned in the response for all Azure Resource Manager resources',
      type: 'object',
      properties: {
        id: {
          readOnly: true,
          type: 'string',
          description: 'Fully qualified resource ID for the resource. Ex - /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/{resourceProviderNamespace}/{resourceType}/{resourceName}'
        },
        name: {
          readOnly: true,
          type: 'string',
          description: 'The name of the resource'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'The type of the resource. E.g. "Microsoft.Compute/virtualMachines" or "Microsoft.Storage/storageAccounts"'
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  description: 'The properties of a storage account’s Blob service.'
}
```
## Misc
The resource version is `2021-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-06-01/blob.json).
