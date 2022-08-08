---
id: Connection
title: Connection
---
Provides a **Connection** from the **Web** group
## Examples
### Replace a connection
```js
exports.createResources = () => [
  {
    type: "Connection",
    group: "Web",
    name: "myConnection",
    properties: () => ({
      properties: {
        displayName: "testManagedApi",
        parameterValues: {},
        customParameterValues: {},
        api: {
          id: "/subscriptions/f34b22a3-2202-4fb1-b040-1332bd928c84/providers/Microsoft.Web/locations/centralus/managedApis/testManagedApi",
        },
      },
      id: "/subscriptions/f34b22a3-2202-4fb1-b040-1332bd928c84/resourceGroups/testResourceGroup/providers/Microsoft.Web/connections/testManagedApi-1",
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      customApi: "myCustomApi",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [CustomApi](../Web/CustomApi.md)
## Swagger Schema
```js
{
  description: 'API connection',
  type: 'object',
  additionalProperties: false,
  properties: {
    properties: {
      properties: {
        displayName: { description: 'Display name', type: 'string' },
        statuses: {
          description: 'Status of the connection',
          type: 'array',
          items: {
            description: 'Connection status',
            type: 'object',
            properties: {
              status: { description: 'The gateway status', type: 'string' },
              target: { description: 'Target of the error', type: 'string' },
              error: {
                description: 'Connection error',
                type: 'object',
                allOf: [
                  {
                    description: 'A resource',
                    type: 'object',
                    additionalProperties: false,
                    properties: {
                      id: {
                        description: 'Resource id',
                        type: 'string',
                        readOnly: true
                      },
                      name: {
                        description: 'Resource name',
                        type: 'string',
                        readOnly: true
                      },
                      type: {
                        description: 'Resource type',
                        type: 'string',
                        readOnly: true
                      },
                      location: {
                        description: 'Resource location',
                        type: 'string'
                      },
                      etag: { description: 'Resource ETag', type: 'string' },
                      tags: {
                        type: 'object',
                        description: 'Resource tags',
                        additionalProperties: { type: 'string' },
                        example: { SampleTagName: 'SampleTagValue' }
                      }
                    },
                    'x-ms-azure-resource': true
                  }
                ],
                properties: {
                  properties: {
                    properties: {
                      code: {
                        description: 'Code of the status',
                        type: 'string'
                      },
                      message: {
                        description: 'Description of the status',
                        type: 'string'
                      }
                    },
                    'x-ms-client-flatten': true
                  }
                }
              }
            }
          }
        },
        parameterValues: {
          description: 'Dictionary of parameter values',
          type: 'object',
          additionalProperties: { type: 'string' }
        },
        customParameterValues: {
          description: 'Dictionary of custom parameter values',
          type: 'object',
          additionalProperties: { type: 'string' }
        },
        nonSecretParameterValues: {
          description: 'Dictionary of nonsecret parameter values',
          type: 'object',
          additionalProperties: { type: 'string' }
        },
        createdTime: {
          format: 'date-time',
          description: 'Timestamp of the connection creation',
          type: 'string'
        },
        changedTime: {
          format: 'date-time',
          description: 'Timestamp of last connection change',
          type: 'string'
        },
        api: {
          type: 'object',
          'x-abstract': true,
          additionalProperties: false,
          properties: {
            swagger: {
              type: 'object',
              description: 'The JSON representation of the swagger'
            },
            brandColor: { type: 'string', description: 'Brand color' },
            description: {
              type: 'string',
              description: 'The custom API description'
            },
            displayName: { type: 'string', description: 'The display name' },
            iconUri: { type: 'string', description: 'The icon URI' },
            name: { type: 'string', description: 'The name of the API' }
          },
          allOf: [
            {
              type: 'object',
              'x-abstract': true,
              additionalProperties: false,
              properties: {
                id: {
                  description: 'Resource reference id',
                  type: 'string'
                },
                type: {
                  description: 'Resource reference type',
                  type: 'string'
                }
              }
            }
          ]
        },
        testLinks: {
          description: 'Links to test the API connection',
          type: 'array',
          items: {
            description: 'API connection properties',
            type: 'object',
            additionalProperties: false,
            properties: {
              requestUri: { description: 'Test link request URI', type: 'string' },
              method: { description: 'HTTP Method', type: 'string' }
            }
          }
        }
      }
    }
  },
  allOf: [
    {
      description: 'A resource',
      type: 'object',
      additionalProperties: false,
      properties: {
        id: { description: 'Resource id', type: 'string', readOnly: true },
        name: {
          description: 'Resource name',
          type: 'string',
          readOnly: true
        },
        type: {
          description: 'Resource type',
          type: 'string',
          readOnly: true
        },
        location: { description: 'Resource location', type: 'string' },
        etag: { description: 'Resource ETag', type: 'string' },
        tags: {
          type: 'object',
          description: 'Resource tags',
          additionalProperties: { type: 'string' },
          example: { SampleTagName: 'SampleTagValue' }
        }
      },
      'x-ms-azure-resource': true
    }
  ]
}
```
## Misc
The resource version is `2016-06-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2016-06-01/logicAppsManagementClient.json).
