---
id: NotebookWorkspace
title: NotebookWorkspace
---
Provides a **NotebookWorkspace** from the **DocumentDB** group
## Examples
### CosmosDBNotebookWorkspaceCreate
```js
exports.createResources = () => [
  {
    type: "NotebookWorkspace",
    group: "DocumentDB",
    name: "myNotebookWorkspace",
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
  description: 'Parameters to create a notebook workspace resource',
  type: 'object',
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
The resource version is `2022-02-15-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-02-15-preview/notebook.json).
