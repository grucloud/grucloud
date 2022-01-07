---
id: WebAppDiagnosticLogsConfiguration
title: WebAppDiagnosticLogsConfiguration
---
Provides a **WebAppDiagnosticLogsConfiguration** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
## Swagger Schema
```js
{
  description: 'Configuration of App Service site logs.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'SiteLogsConfig resource specific properties',
      type: 'object',
      properties: {
        applicationLogs: {
          description: 'Application logs configuration.',
          type: 'object',
          properties: {
            fileSystem: {
              description: 'Application logs to file system configuration.',
              type: 'object',
              properties: {
                level: {
                  description: 'Log level.',
                  default: 'Off',
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
              description: 'Application logs to azure table storage configuration.',
              required: [ 'sasUrl' ],
              type: 'object',
              properties: {
                level: {
                  description: 'Log level.',
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
                  description: 'SAS URL to an Azure table with add/query/delete permissions.',
                  type: 'string'
                }
              }
            },
            azureBlobStorage: {
              description: 'Application logs to blob storage configuration.',
              type: 'object',
              properties: {
                level: {
                  description: 'Log level.',
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
                  description: 'SAS url to a azure blob container with read/write/list/delete permissions.',
                  type: 'string'
                },
                retentionInDays: {
                  format: 'int32',
                  description: 'Retention in days.\n' +
                    'Remove blobs older than X days.\n' +
                    '0 or lower means no retention.',
                  type: 'integer'
                }
              }
            }
          }
        },
        httpLogs: {
          description: 'HTTP logs configuration.',
          type: 'object',
          properties: {
            fileSystem: {
              description: 'Http logs to file system configuration.',
              type: 'object',
              properties: {
                retentionInMb: {
                  format: 'int32',
                  description: 'Maximum size in megabytes that http log files can use.\n' +
                    'When reached old log files will be removed to make space for new ones.\n' +
                    'Value can range between 25 and 100.',
                  maximum: 100,
                  minimum: 25,
                  type: 'integer'
                },
                retentionInDays: {
                  format: 'int32',
                  description: 'Retention in days.\n' +
                    'Remove files older than X days.\n' +
                    '0 or lower means no retention.',
                  type: 'integer'
                },
                enabled: {
                  description: 'True if configuration is enabled, false if it is disabled and null if configuration is not set.',
                  type: 'boolean'
                }
              }
            },
            azureBlobStorage: {
              description: 'Http logs to azure blob storage configuration.',
              type: 'object',
              properties: {
                sasUrl: {
                  description: 'SAS url to a azure blob container with read/write/list/delete permissions.',
                  type: 'string'
                },
                retentionInDays: {
                  format: 'int32',
                  description: 'Retention in days.\n' +
                    'Remove blobs older than X days.\n' +
                    '0 or lower means no retention.',
                  type: 'integer'
                },
                enabled: {
                  description: 'True if configuration is enabled, false if it is disabled and null if configuration is not set.',
                  type: 'boolean'
                }
              }
            }
          }
        },
        failedRequestsTracing: {
          description: 'Failed requests tracing configuration.',
          type: 'object',
          properties: {
            enabled: {
              description: 'True if configuration is enabled, false if it is disabled and null if configuration is not set.',
              type: 'boolean'
            }
          }
        },
        detailedErrorMessages: {
          description: 'Detailed error messages configuration.',
          type: 'object',
          properties: {
            enabled: {
              description: 'True if configuration is enabled, false if it is disabled and null if configuration is not set.',
              type: 'boolean'
            }
          }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/WebApps.json).
