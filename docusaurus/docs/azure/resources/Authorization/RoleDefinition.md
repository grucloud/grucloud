---
id: RoleDefinition
title: RoleDefinition
---
Provides a **RoleDefinition** from the **Authorization** group
## Examples
### Create role definition
```js
exports.createResources = () => [
  { type: "RoleDefinition", group: "Authorization", name: "myRoleDefinition" },
];

```
## Dependencies

## Swagger Schema
```js
{
  properties: {
    id: {
      type: 'string',
      readOnly: true,
      description: 'The role definition ID.'
    },
    name: {
      type: 'string',
      readOnly: true,
      description: 'The role definition name.'
    },
    type: {
      type: 'string',
      readOnly: true,
      description: 'The role definition type.'
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Role definition properties.',
      properties: {
        roleName: { type: 'string', description: 'The role name.' },
        description: {
          type: 'string',
          description: 'The role definition description.'
        },
        type: {
          type: 'string',
          description: 'The role type.',
          'x-ms-client-name': 'roleType'
        },
        permissions: {
          type: 'array',
          items: {
            properties: {
              actions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Allowed actions.'
              },
              notActions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Denied actions.'
              },
              dataActions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Allowed Data actions.'
              },
              notDataActions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Denied Data actions.'
              }
            },
            type: 'object',
            description: 'Role definition permissions.'
          },
          description: 'Role definition permissions.'
        },
        assignableScopes: {
          type: 'array',
          items: { type: 'string' },
          description: 'Role definition assignable scopes.'
        }
      },
      type: 'object'
    }
  },
  type: 'object',
  description: 'Role definition.'
}
```
## Misc
The resource version is `2018-01-01-preview`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/authorization/resource-manager/Microsoft.Authorization/preview/2018-01-01-preview/authorization-RoleDefinitionsCalls.json).
