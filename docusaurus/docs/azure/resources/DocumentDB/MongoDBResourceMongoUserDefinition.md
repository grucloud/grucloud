---
id: MongoDBResourceMongoUserDefinition
title: MongoDBResourceMongoUserDefinition
---
Provides a **MongoDBResourceMongoUserDefinition** from the **DocumentDB** group
## Examples
### CosmosDBMongoDBUserDefinitionCreateUpdate
```js
exports.createResources = () => [
  {
    type: "MongoDBResourceMongoUserDefinition",
    group: "DocumentDB",
    name: "myMongoDBResourceMongoUserDefinition",
    properties: () => ({
      properties: {
        userName: "myUserName",
        password: "myPassword",
        databaseName: "sales",
        customData: "My custom data",
        roles: [{ role: "myReadRole", db: "sales" }],
        mechanisms: "SCRAM-SHA-256",
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
  description: 'Parameters to create and update an Azure Cosmos DB Mongo User Definition.',
  type: 'object',
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties to create and update an Azure Cosmos DB Mongo User Definition.',
      type: 'object',
      properties: {
        userName: {
          type: 'string',
          description: 'The user name for User Definition.'
        },
        password: {
          type: 'string',
          description: 'The password for User Definition. Response does not contain user password.'
        },
        databaseName: {
          type: 'string',
          description: 'The database name for which access is being granted for this User Definition.'
        },
        customData: {
          type: 'string',
          description: 'A custom definition for the USer Definition.'
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
          description: 'The set of roles inherited by the User Definition.'
        },
        mechanisms: {
          type: 'string',
          description: 'The Mongo Auth mechanism. For now, we only support auth mechanism SCRAM-SHA-256.'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2022-02-15-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/cosmos-db/resource-manager/Microsoft.DocumentDB/preview/2022-02-15-preview/mongorbac.json).
