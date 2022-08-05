---
id: Service
title: Service
---
Provides a **Service** from the **DocumentDB** group
## Examples
### DataTransferServiceCreate
```js
exports.createResources = () => [
  {
    type: "Service",
    group: "DocumentDB",
    name: "myService",
    properties: () => ({
      properties: {
        instanceSize: "Cosmos.D4s",
        instanceCount: 1,
        serviceType: "DataTransfer",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myDatabaseAccount",
    }),
  },
];

```

### SqlDedicatedGatewayServiceCreate
```js
exports.createResources = () => [
  {
    type: "Service",
    group: "DocumentDB",
    name: "myService",
    properties: () => ({
      properties: {
        instanceSize: "Cosmos.D4s",
        instanceCount: 1,
        serviceType: "SqlDedicatedGateway",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myDatabaseAccount",
    }),
  },
];

```

### GraphAPIComputeServiceCreate
```js
exports.createResources = () => [
  {
    type: "Service",
    group: "DocumentDB",
    name: "myService",
    properties: () => ({
      properties: {
        instanceSize: "Cosmos.D4s",
        instanceCount: 1,
        serviceType: "GraphAPICompute",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      account: "myDatabaseAccount",
    }),
  },
];

```

### MaterializedViewsBuilderServiceCreate
```js
exports.createResources = () => [
  {
    type: "Service",
    group: "DocumentDB",
    name: "myService",
    properties: () => ({
      properties: {
        instanceSize: "Cosmos.D4s",
        instanceCount: 1,
        serviceType: "MaterializedViewsBuilder",
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
  description: 'Parameters for Create or Update Request for ServiceResource',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties in ServiceResourceCreateUpdateParameters.',
      type: 'object',
      properties: {
        instanceSize: {
          type: 'string',
          enum: [ 'Cosmos.D4s', 'Cosmos.D8s', 'Cosmos.D16s' ],
          description: 'Instance type for the service.',
          'x-ms-enum': { modelAsString: true, name: 'ServiceSize' }
        },
        instanceCount: {
          description: 'Instance count for the service.',
          type: 'integer',
          minimum: 0,
          format: 'int32'
        },
        serviceType: {
          type: 'string',
          enum: [
            'SqlDedicatedGateway',
            'DataTransfer',
            'GraphAPICompute',
            'MaterializedViewsBuilder'
          ],
          description: 'ServiceType for the service.',
          'x-ms-enum': { modelAsString: true, name: 'ServiceType' }
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-05-15`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/services.json).
