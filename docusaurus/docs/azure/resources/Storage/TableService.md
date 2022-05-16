---
id: TableService
title: TableService
---
Provides a **TableService** from the **Storage** group
## Examples
### TableServicesPut
```js
exports.createResources = () => [
  {
    type: "TableService",
    group: "Storage",
    name: "myTableService",
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
          description: 'Specifies CORS rules for the Table service. You can include up to five CorsRule elements in the request. If no CorsRule elements are included in the request body, all CORS rules will be deleted, and CORS will be disabled for the Table service.',
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
        }
      },
      'x-ms-client-flatten': true,
      'x-ms-client-name': 'TableServiceProperties',
      description: 'The properties of a storage account’s Table service.'
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
  description: 'The properties of a storage account’s Table service.'
}
```
## Misc
The resource version is `2021-09-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/storage/resource-manager/Microsoft.Storage/stable/2021-09-01/table.json).
