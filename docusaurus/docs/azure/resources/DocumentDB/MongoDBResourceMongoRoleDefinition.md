---
id: MongoDBResourceMongoRoleDefinition
title: MongoDBResourceMongoRoleDefinition
---
Provides a **MongoDBResourceMongoRoleDefinition** from the **DocumentDB** group
## Examples
### CosmosDBMongoDBRoleDefinitionCreateUpdate
```js
exports.createResources = () => [
  {
    type: "MongoDBResourceMongoRoleDefinition",
    group: "DocumentDB",
    name: "myMongoDBResourceMongoRoleDefinition",
    properties: () => ({
      properties: {
        roleName: "myRoleName",
        databaseName: "sales",
        privileges: [
          {
            resource: { db: "sales", collection: "sales" },
            actions: ["insert", "find"],
          },
        ],
        roles: [{ role: "myInheritedRole", db: "sales" }],
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
  description: 'Parameters to create and update an Azure Cosmos DB Mongo Role Definition.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update an Azure Cosmos DB Mongo Role Definition.',
      type: 'object',
      properties: {
        roleName: {
          type: 'string',
          description: 'A user-friendly name for the Role Definition. Must be unique for the database account.'
        },
        type: {
          type: 'string',
          enum: [ 'BuiltInRole', 'CustomRole' ],
          description: 'Indicates whether the Role Definition was built-in or user created.',
          'x-ms-enum': { name: 'MongoRoleDefinitionType', modelAsString: false }
        },
        databaseName: {
          type: 'string',
          description: 'The database name for which access is being granted for this Role Definition.'
        },
        privileges: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              resource: {
                type: 'object',
                properties: {
                  db: {
                    type: 'string',
                    description: 'The database name the role is applied.'
                  },
                  collection: {
                    type: 'string',
                    description: 'The collection name the role is applied.'
                  }
                },
                description: 'An Azure Cosmos DB Mongo DB Resource.'
              },
              actions: {
                type: 'array',
                items: { type: 'string' },
                description: 'An array of actions that are allowed.'
              }
            },
            description: 'The set of data plane operations permitted through this Role Definition.'
          },
          description: 'A set of privileges contained by the Role Definition. This will allow application of this Role Definition on the entire database account or any underlying Database / Collection. Scopes higher than Database are not enforceable as privilege.'
        },
        roles: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              db: {
                type: 'string',
                description: 'The database name the role is applied.'
              },
              role: { type: 'string', description: 'The role name.' }
            },
            description: 'The set of roles permitted through this Role Definition.'
          },
          description: 'The set of roles inherited by this Role Definition.'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-02-15-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-02-15-preview/mongorbac.json).
