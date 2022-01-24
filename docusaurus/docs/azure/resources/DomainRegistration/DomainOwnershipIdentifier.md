---
id: DomainOwnershipIdentifier
title: DomainOwnershipIdentifier
---
Provides a **DomainOwnershipIdentifier** from the **DomainRegistration** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Domain](../DomainRegistration/Domain.md)
## Swagger Schema
```js
{
  description: 'Domain ownership Identifier.',
  type: 'object',
  allOf: [
    {
      description: 'Azure proxy only resource. This resource is not tracked by Azure Resource Manager.',
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'DomainOwnershipIdentifier resource specific properties',
      type: 'object',
      properties: { ownershipId: { description: 'Ownership Id.', type: 'string' } },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.DomainRegistration/stable/2021-03-01/Domains.json).
