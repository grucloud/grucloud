---
id: SiteLogsConfig
title: SiteLogsConfig
---
Provides a **SiteLogsConfig** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
## Swagger Schema
```js
{
  description: 'Configuration of Azure web site',
  type: 'object',
  allOf: [
    {
      required: [ 'location' ],
      properties: {
        id: { description: 'Resource Id', type: 'string' },
        name: { description: 'Resource Name', type: 'string' },
        kind: { description: 'Kind of resource', type: 'string' },
        location: { description: 'Resource Location', type: 'string' },
        type: { description: 'Resource type', type: 'string' },
        tags: {
          description: 'Resource tags',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      properties: {
        applicationLogs: {
          description: 'Application logs configuration',
          type: 'object',
          properties: {
            fileSystem: {
              description: 'Application logs to file system configuration',
              type: 'object',
              properties: {
                level: {
                  description: 'Log level',
                  enum: [
                    'Off',
                    'Verbose',
                    'Information',
                    'Warning',
                    'Error'
                  ],
                  type: 'string',
                  'x-ms-enum': { name: 'LogLevel', modelAsString: false }
                }
              }
            },
            azureTableStorage: {
              description: 'Application logs to azure table storage configuration',
              type: 'object',
              properties: {
                level: {
                  description: 'Log level',
                  enum: [
                    'Off',
                    'Verbose',
                    'Information',
                    'Warning',
                    'Error'
                  ],
                  type: 'string',
                  'x-ms-enum': { name: 'LogLevel', modelAsString: false }
                },
                sasUrl: {
                  description: 'SAS url to an azure table with add/query/delete permissions',
                  type: 'string'
                }
              }
            },
            azureBlobStorage: {
              description: 'Application logs to blob storage configuration',
              type: 'object',
              properties: {
                level: {
                  description: 'Log level',
                  enum: [
                    'Off',
                    'Verbose',
                    'Information',
                    'Warning',
                    'Error'
                  ],
                  type: 'string',
                  'x-ms-enum': { name: 'LogLevel', modelAsString: false }
                },
                sasUrl: {
                  description: 'SAS url to a azure blob container with read/write/list/delete permissions',
                  type: 'string'
                },
                retentionInDays: {
                  format: 'int32',
                  description: 'Retention in days.\r\n' +
                    '            Remove blobs older than X days.\r\n' +
                    '            0 or lower means no retention.',
                  type: 'integer'
                }
              }
            }
          }
        },
        httpLogs: {
          description: 'Http logs configuration',
          type: 'object',
          properties: {
            fileSystem: {
              description: 'Http logs to file system configuration',
              type: 'object',
              properties: {
                retentionInMb: {
                  format: 'int32',
                  description: 'Maximum size in megabytes that http log files can use.\r\n' +
                    '            When reached old log files will be removed to make space for new ones.\r\n' +
                    '            Value can range between 25 and 100.',
                  type: 'integer'
                },
                retentionInDays: {
                  format: 'int32',
                  description: 'Retention in days.\r\n' +
                    '            Remove files older than X days.\r\n' +
                    '            0 or lower means no retention.',
                  type: 'integer'
                },
                enabled: { description: 'Enabled', type: 'boolean' }
              }
            },
            azureBlobStorage: {
              description: 'Http logs to azure blob storage configuration',
              type: 'object',
              properties: {
                sasUrl: {
                  description: 'SAS url to a azure blob container with read/write/list/delete permissions',
                  type: 'string'
                },
                retentionInDays: {
                  format: 'int32',
                  description: 'Retention in days.\r\n' +
                    '            Remove blobs older than X days.\r\n' +
                    '            0 or lower means no retention.',
                  type: 'integer'
                },
                enabled: { description: 'Enabled', type: 'boolean' }
              }
            }
          }
        },
        failedRequestsTracing: {
          description: 'Failed requests tracing configuration',
          type: 'object',
          properties: { enabled: { description: 'Enabled', type: 'boolean' } }
        },
        detailedErrorMessages: {
          description: 'Detailed error messages configuration',
          type: 'object',
          properties: { enabled: { description: 'Enabled', type: 'boolean' } }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2015-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json).
