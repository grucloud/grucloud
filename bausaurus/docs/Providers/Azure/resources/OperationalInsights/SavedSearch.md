---
id: SavedSearch
title: SavedSearch
---
Provides a **SavedSearch** from the **OperationalInsights** group
## Examples
### SavedSearchCreateOrUpdate
```js
exports.createResources = () => [
  {
    type: "SavedSearch",
    group: "OperationalInsights",
    name: "mySavedSearch",
    properties: () => ({
      properties: {
        category: "Saved Search Test Category",
        displayName: "Create or Update Saved Search Test",
        version: 2,
        functionAlias: "heartbeat_func",
        functionParameters: "a:int=1",
        query: "Heartbeat | summarize Count() by Computer | take a",
        tags: [{ name: "Group", value: "Computer" }],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      workspace: "myWorkspace",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Workspace](../OperationalInsights/Workspace.md)
## Swagger Schema
```json
{
  properties: {
    etag: {
      type: 'string',
      description: 'The ETag of the saved search. To override an existing saved search, use "*" or specify the current Etag'
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'The properties of the saved search.',
      properties: {
        category: {
          type: 'string',
          description: 'The category of the saved search. This helps the user to find a saved search faster. '
        },
        displayName: { type: 'string', description: 'Saved search display name.' },
        query: {
          type: 'string',
          description: 'The query expression for the saved search.'
        },
        functionAlias: {
          type: 'string',
          description: 'The function alias if query serves as a function.'
        },
        functionParameters: {
          type: 'string',
          description: "The optional function parameters if query serves as a function. Value should be in the following format: 'param-name1:type1 = default_value1, param-name2:type2 = default_value2'. For more examples and proper syntax please refer to https://docs.microsoft.com/en-us/azure/kusto/query/functions/user-defined-functions."
        },
        version: {
          type: 'integer',
          format: 'int64',
          description: 'The version number of the query language. The current version is 2 and is the default.'
        },
        tags: {
          type: 'array',
          items: {
            properties: {
              name: { type: 'string', description: 'The tag name.' },
              value: { type: 'string', description: 'The tag value.' }
            },
            required: [ 'name', 'value' ],
            description: 'A tag of a saved search.'
          },
          'x-ms-identifiers': [ 'name' ],
          description: 'The tags attached to the saved search.'
        }
      },
      required: [ 'category', 'displayName', 'query' ]
    }
  },
  required: [ 'properties' ],
  allOf: [
    {
      title: 'Proxy Resource',
      description: 'The resource model definition for a Azure Resource Manager proxy resource. It will not have tags and a location',
      type: 'object',
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
      ]
    }
  ],
  description: 'Value object for saved search results.'
}
```
## Misc
The resource version is `2020-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/operationalinsights/resource-manager/Microsoft.OperationalInsights/stable/2020-08-01/SavedSearches.json).
