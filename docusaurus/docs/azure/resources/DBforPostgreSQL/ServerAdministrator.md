---
id: ServerAdministrator
title: ServerAdministrator
---
Provides a **ServerAdministrator** from the **DBforPostgreSQL** group
## Examples
### ServerAdministratorCreate
```js
provider.DBforPostgreSQL.makeServerAdministrator({
  name: "myServerAdministrator",
  properties: () => ({
    properties: {
      administratorType: "ActiveDirectory",
      login: "bob@contoso.com",
      sid: "c6b82b90-a647-49cb-8a62-0d2d3cb7ac7c",
      tenantId: "c6b82b90-a647-49cb-8a62-0d2d3cb7ac7c",
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    server: resources.DBforPostgreSQL.Server["myServer"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Server](../DBforPostgreSQL/Server.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the server AAD administrator.',
      properties: {
        administratorType: {
          type: 'string',
          description: 'The type of administrator.',
          enum: [ 'ActiveDirectory' ],
          'x-ms-enum': { name: 'AdministratorType' }
        },
        login: {
          type: 'string',
          description: 'The server administrator login account name.'
        },
        sid: {
          type: 'string',
          description: 'The server administrator Sid (Secure ID).',
          format: 'uuid'
        },
        tenantId: {
          type: 'string',
          description: 'The server Active Directory Administrator tenant id.',
          format: 'uuid'
        }
      },
      required: [ 'tenantId', 'administratorType', 'login', 'sid' ]
    }
  },
  description: 'Represents a and external administrator to be created.',
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
  ]
}
```
## Misc
The resource version is `2017-12-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/postgresql/resource-manager/Microsoft.DBforPostgreSQL/stable/2017-12-01/postgresql.json).
