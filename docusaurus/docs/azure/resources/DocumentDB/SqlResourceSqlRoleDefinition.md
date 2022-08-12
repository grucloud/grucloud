---
id: SqlResourceSqlRoleDefinition
title: SqlResourceSqlRoleDefinition
---
Provides a **SqlResourceSqlRoleDefinition** from the **DocumentDB** group
## Examples
### CosmosDBSqlRoleDefinitionCreateUpdate
```js
exports.createResources = () => [
  {
    type: "SqlResourceSqlRoleDefinition",
    group: "DocumentDB",
    name: "mySqlResourceSqlRoleDefinition",
    properties: () => ({
      properties: {
        roleName: "myRoleName",
        type: "CustomRole",
        assignableScopes: [
          "/subscriptions/mySubscriptionId/resourceGroups/myResourceGroupName/providers/Microsoft.DocumentDB/databaseAccounts/myAccountName/dbs/sales",
          "/subscriptions/mySubscriptionId/resourceGroups/myResourceGroupName/providers/Microsoft.DocumentDB/databaseAccounts/myAccountName/dbs/purchases",
        ],
        permissions: [
          {
            dataActions: [
              "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/create",
              "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/read",
            ],
            notDataActions: [],
          },
        ],
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
```json
{
  description: 'Parameters to create and update an Azure Cosmos DB SQL Role Definition.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update an Azure Cosmos DB SQL Role Definition.',
      properties: {
        roleName: {
          type: 'string',
          description: 'A user-friendly name for the Role Definition. Must be unique for the database account.'
        },
        type: {
          type: 'string',
          enum: [ 'BuiltInRole', 'CustomRole' ],
          description: 'Indicates whether the Role Definition was built-in or user created.',
          'x-ms-enum': { name: 'RoleDefinitionType', modelAsString: false }
        },
        assignableScopes: {
          type: 'array',
          items: { type: 'string' },
          description: 'A set of fully qualified Scopes at or below which Role Assignments may be created using this Role Definition. This will allow application of this Role Definition on the entire database account or any underlying Database / Collection. Must have at least one element. Scopes higher than Database account are not enforceable as assignable Scopes. Note that resources referenced in assignable Scopes need not exist.'
        },
        permissions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              dataActions: {
                type: 'array',
                items: { type: 'string' },
                description: 'An array of data actions that are allowed.'
              },
              notDataActions: {
                type: 'array',
                items: { type: 'string' },
                description: 'An array of data actions that are denied.'
              }
            },
            description: 'The set of data plane operations permitted through this Role Definition.'
          },
          description: 'The set of operations allowed through this Role Definition.'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-05-15`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/stable/2022-05-15/rbac.json).
