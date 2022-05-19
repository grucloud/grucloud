---
id: SqlResourceSqlRoleAssignment
title: SqlResourceSqlRoleAssignment
---
Provides a **SqlResourceSqlRoleAssignment** from the **DocumentDB** group
## Examples
### CosmosDBSqlRoleAssignmentCreateUpdate
```js
exports.createResources = () => [
  {
    type: "SqlResourceSqlRoleAssignment",
    group: "DocumentDB",
    name: "mySqlResourceSqlRoleAssignment",
    properties: () => ({
      properties: {
        roleDefinitionId:
          "/subscriptions/mySubscriptionId/resourceGroups/myResourceGroupName/providers/Microsoft.DocumentDB/databaseAccounts/myAccountName/sqlRoleDefinitions/myRoleDefinitionId",
        scope:
          "/subscriptions/mySubscriptionId/resourceGroups/myResourceGroupName/providers/Microsoft.DocumentDB/databaseAccounts/myAccountName/dbs/purchases/colls/redmond-purchases",
        principalId: "myPrincipalId",
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      roleDefinition: "myRoleDefinition",
      account: "myDatabaseAccount",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [RoleDefinition](../Authorization/RoleDefinition.md)
- [DatabaseAccount](../DocumentDB/DatabaseAccount.md)
## Swagger Schema
```js
{
  description: 'Parameters to create and update an Azure Cosmos DB SQL Role Assignment.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update an Azure Cosmos DB SQL Role Assignment.',
      type: 'object',
      properties: {
        roleDefinitionId: {
          type: 'string',
          description: 'The unique identifier for the associated Role Definition.'
        },
        scope: {
          type: 'string',
          description: 'The data plane resource path for which access is being granted through this Role Assignment.'
        },
        principalId: {
          type: 'string',
          description: 'The unique identifier for the associated AAD principal in the AAD graph to which access is being granted through this Role Assignment. Tenant ID for the principal is inferred using the tenant associated with the subscription.'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-02-15-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-02-15-preview/rbac.json).
