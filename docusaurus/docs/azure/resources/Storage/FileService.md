---
id: FileService
title: FileService
---
Provides a **FileService** from the **Storage** group
## Examples
### PutFileServices
```js
exports.createResources = () => [
  {
    type: "FileService",
    group: "Storage",
    name: "myFileService",
    properties: () => ({
      properties: {
        cors: {
          corsRules: [
            {
              allowedOrigins: [
                "http://www.contoso.com",
                "http://www.fabrikam.com",
              ],
              allowedMethods: [
                "GET",
                "HEAD",
                "POST",
                "OPTIONS",
                "MERGE",
                "PUT",
              ],
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
                "x-ms-meta-target*",
              ],
              allowedHeaders: ["x-ms-meta-12345675754564*"],
            },
          ],
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myStorageAccount",
    }),
  },
];

```

### PutFileServices_EnableSMBMultichannel
```js
exports.createResources = () => [
  {
    type: "FileService",
    group: "Storage",
    name: "myFileService",
    properties: () => ({
      properties: {
        protocolSettings: { smb: { multichannel: { enabled: true } } },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myStorageAccount",
    }),
  },
];

```

### PutFileServices_EnableSecureSmbFeatures
```js
exports.createResources = () => [
  {
    type: "FileService",
    group: "Storage",
    name: "myFileService",
    properties: () => ({
      properties: {
        protocolSettings: {
          smb: {
            versions: "SMB2.1;SMB3.0;SMB3.1.1",
            authenticationMethods: "NTLMv2;Kerberos",
            kerberosTicketEncryption: "RC4-HMAC;AES-256",
            channelEncryption: "AES-128-CCM;AES-128-GCM;AES-256-GCM",
          },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myStorageAccount",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [StorageAccount](../Storage/StorageAccount.md)
## Swagger Schema
```json
{
  properties: {
    properties: {
      properties: {
        cors: {
          description: 'Specifies CORS rules for the File service. You can include up to five CorsRule elements in the request. If no CorsRule elements are included in the request body, all CORS rules will be deleted, and CORS will be disabled for the File service.',
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
                        'PUT',    'PATCH'
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
        shareDeleteRetentionPolicy: {
          description: 'The file service properties for share soft delete.',
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
            },
            allowPermanentDelete: {
              type: 'boolean',
              description: 'This property when set to true allows deletion of the soft deleted blob versions and snapshots. This property cannot be used blob restore policy. This property only applies to blob service and does not apply to containers or file share.'
            }
          }
        },
        protocolSettings: {
          description: 'Protocol settings for file service',
          properties: {
            smb: {
              description: 'Setting for SMB protocol',
              properties: {
                multichannel: {
                  description: 'Multichannel setting. Applies to Premium FileStorage only.',
                  properties: {
                    enabled: {
                      type: 'boolean',
                      description: 'Indicates whether multichannel is enabled'
                    }
                  }
                },
                versions: {
                  type: 'string',
                  description: "SMB protocol versions supported by server. Valid values are SMB2.1, SMB3.0, SMB3.1.1. Should be passed as a string with delimiter ';'."
                },
                authenticationMethods: {
                  type: 'string',
                  description: "SMB authentication methods supported by server. Valid values are NTLMv2, Kerberos. Should be passed as a string with delimiter ';'."
                },
                kerberosTicketEncryption: {
                  type: 'string',
                  description: "Kerberos ticket encryption supported by server. Valid values are RC4-HMAC, AES-256. Should be passed as a string with delimiter ';'"
                },
                channelEncryption: {
                  type: 'string',
                  description: "SMB channel encryption supported by server. Valid values are AES-128-CCM, AES-128-GCM, AES-256-GCM. Should be passed as a string with delimiter ';'."
                }
              }
            }
          }
        }
      },
      'x-ms-client-flatten': true,
      'x-ms-client-name': 'FileServiceProperties',
      description: 'The properties of File services in storage account.'
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
  description: 'The properties of File services in storage account.'
}
```
## Misc
The resource version is `2021-09-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-09-01/file.json).
