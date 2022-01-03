---
id: WebAppPrivateAccessSlot
title: WebAppPrivateAccessSlot
---
Provides a **WebAppPrivateAccessSlot** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
- [SiteSlot](../Web/SiteSlot.md)
## Swagger Schema
```js
{
  description: 'Description of the parameters of Private Access for a Web Site.',
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
      description: 'PrivateAccess resource specific properties',
      type: 'object',
      properties: {
        enabled: {
          description: 'Whether private access is enabled or not.',
          type: 'boolean'
        },
        virtualNetworks: {
          description: 'The Virtual Networks (and subnets) allowed to access the site privately.',
          type: 'array',
          items: {
            description: 'Description of a Virtual Network that is useable for private site access.',
            type: 'object',
            properties: {
              name: {
                description: 'The name of the Virtual Network.',
                type: 'string'
              },
              key: {
                format: 'int32',
                description: 'The key (ID) of the Virtual Network.',
                type: 'integer'
              },
              resourceId: {
                description: 'The ARM uri of the Virtual Network',
                type: 'string'
              },
              subnets: {
                description: 'A List of subnets that access is allowed to on this Virtual Network. An empty array (but not null) is interpreted to mean that all subnets are allowed within this Virtual Network.',
                type: 'array',
                items: {
                  description: 'Description of a Virtual Network subnet that is useable for private site access.',
                  type: 'object',
                  properties: {
                    name: {
                      description: 'The name of the subnet.',
                      type: 'string'
                    },
                    key: {
                      format: 'int32',
                      description: 'The key (ID) of the subnet.',
                      type: 'integer'
                    }
                  }
                }
              }
            }
          }
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-02-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-02-01/WebApps.json).
