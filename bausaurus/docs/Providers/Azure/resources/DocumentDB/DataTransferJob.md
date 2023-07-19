---
id: DataTransferJob
title: DataTransferJob
---
Provides a **DataTransferJob** from the **DocumentDB** group
## Examples
### CosmosDBDataTransferJobCreate
```js
exports.createResources = () => [
  {
    type: "DataTransferJob",
    group: "DocumentDB",
    name: "myDataTransferJob",
    properties: () => ({
      properties: {
        source: {
          component: "CosmosDBCassandra",
          keyspaceName: "keyspace",
          tableName: "table",
        },
        destination: {
          component: "AzureBlobStorage",
          containerName: "blob_container",
          endpointUrl: "https://blob.windows.net",
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myDatabaseAccount",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [DatabaseAccount](../DocumentDB/DatabaseAccount.md)
## Swagger Schema
```js
{
  description: 'Parameters to create Data Transfer Job',
  type: 'object',
  properties: {
    properties: {
      description: 'Data Transfer Create Job Properties',
      type: 'object',
      properties: {
        jobName: { readOnly: true, type: 'string', description: 'Job Name' },
        source: {
          description: 'Source DataStore details',
          type: 'object',
          properties: {
            component: {
              type: 'string',
              enum: [
                'CosmosDBCassandra',
                'CosmosDBSql',
                'AzureBlobStorage'
              ],
              'x-ms-enum': { name: 'DataTransferComponent', modelAsString: true },
              default: 'CosmosDBCassandra'
            }
          },
          discriminator: 'component',
          required: [ 'component' ]
        },
        destination: {
          description: 'Destination DataStore details',
          type: 'object',
          properties: {
            component: {
              type: 'string',
              enum: [
                'CosmosDBCassandra',
                'CosmosDBSql',
                'AzureBlobStorage'
              ],
              'x-ms-enum': { name: 'DataTransferComponent', modelAsString: true },
              default: 'CosmosDBCassandra'
            }
          },
          discriminator: 'component',
          required: [ 'component' ]
        },
        status: { readOnly: true, type: 'string', description: 'Job Status' },
        processedCount: {
          readOnly: true,
          type: 'integer',
          description: 'Processed Count.',
          format: 'int64'
        },
        totalCount: {
          readOnly: true,
          type: 'integer',
          description: 'Total Count.',
          format: 'int64'
        },
        lastUpdatedUtcTime: {
          readOnly: true,
          type: 'string',
          format: 'date-time',
          description: 'Last Updated Time (ISO-8601 format).'
        },
        workerCount: {
          description: 'Worker count',
          type: 'integer',
          minimum: 0,
          format: 'int32'
        },
        error: {
          readOnly: true,
          description: 'Error response for Faulted job',
          properties: {
            code: { description: 'Error code.', type: 'string' },
            message: {
              description: 'Error message indicating why the operation failed.',
              type: 'string'
            }
          }
        }
      },
      required: [ 'source', 'destination' ]
    }
  },
  required: [ 'properties' ],
  allOf: [
    {
      type: 'object',
      description: 'The resource model definition for a ARM proxy resource. It will have everything other than required location and tags',
      properties: {
        id: {
          readOnly: true,
          type: 'string',
          description: 'The unique resource identifier of the database account.'
        },
        name: {
          readOnly: true,
          type: 'string',
          description: 'The name of the database account.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'The type of Azure resource.'
        }
      },
      'x-ms-azure-resource': true
    }
  ]
}
```
## Misc
The resource version is `2022-05-15-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-05-15-preview/dataTransferService.json).
