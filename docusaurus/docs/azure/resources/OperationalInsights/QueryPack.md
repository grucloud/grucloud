---
id: QueryPack
title: QueryPack
---
Provides a **QueryPack** from the **OperationalInsights** group
## Examples
### QueryPackCreate
```js
exports.createResources = () => [
  {
    type: "QueryPack",
    group: "OperationalInsights",
    name: "myQueryPack",
    properties: () => ({ location: "South Central US", properties: {} }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      query: "myQuery",
    }),
  },
];

```

### QueryPackUpdate
```js
exports.createResources = () => [
  {
    type: "QueryPack",
    group: "OperationalInsights",
    name: "myQueryPack",
    properties: () => ({
      location: "South Central US",
      tags: { Tag1: "Value1" },
      properties: {},
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      query: "myQuery",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Query](../OperationalInsights/Query.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties that define a Log Analytics QueryPack resource.',
      type: 'object',
      properties: {
        queryPackId: {
          type: 'string',
          description: 'The unique ID of your application. This field cannot be changed.',
          readOnly: true
        },
        timeCreated: {
          type: 'string',
          readOnly: true,
          description: 'Creation Date for the Log Analytics QueryPack, in ISO 8601 format.',
          format: 'date-time'
        },
        timeModified: {
          type: 'string',
          readOnly: true,
          description: 'Last modified date of the Log Analytics QueryPack, in ISO 8601 format.',
          format: 'date-time'
        },
        provisioningState: {
          type: 'string',
          description: 'Current state of this QueryPack: whether or not is has been provisioned within the resource group it is defined. Users cannot change this value but are able to read from it. Values will include Succeeded, Deploying, Canceled, and Failed.',
          readOnly: true
        }
      }
    }
  },
  allOf: [
    {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          readOnly: true,
          description: 'Azure resource Id'
        },
        name: {
          type: 'string',
          description: 'Azure resource name',
          readOnly: true
        },
        type: {
          type: 'string',
          readOnly: true,
          description: 'Azure resource type'
        },
        location: {
          type: 'string',
          description: 'Resource location',
          'x-ms-mutability': [ 'create', 'read' ]
        },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags'
        }
      },
      required: [ 'location' ],
      'x-ms-azure-resource': true,
      description: 'An azure resource object'
    }
  ],
  required: [ 'properties' ],
  description: 'An Log Analytics QueryPack definition.'
}
```
## Misc
The resource version is `2019-09-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2019-09-01/QueryPacks.json).
