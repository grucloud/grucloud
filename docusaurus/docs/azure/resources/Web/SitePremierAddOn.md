---
id: SitePremierAddOn
title: SitePremierAddOn
---
Provides a **SitePremierAddOn** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Site](../Web/Site.md)
## Swagger Schema
```js
{
  type: 'object',
  properties: {
    location: {
      description: 'Geo region resource belongs to e.g. SouthCentralUS, SouthEastAsia',
      type: 'string'
    },
    tags: {
      description: 'Tags associated with resource',
      type: 'object',
      additionalProperties: { type: 'string' }
    },
    plan: {
      description: 'Azure resource manager plan',
      type: 'object',
      properties: {
        name: { description: 'The name', type: 'string' },
        publisher: { description: 'The publisher', type: 'string' },
        product: { description: 'The product', type: 'string' },
        promotionCode: { description: 'The promotion code', type: 'string' },
        version: { description: 'Version of product', type: 'string' }
      }
    },
    properties: {
      description: 'Resource specific properties',
      type: 'object',
      properties: {}
    },
    sku: {
      description: 'Sku description of the resource',
      type: 'object',
      properties: {
        name: { description: 'Name of the resource sku', type: 'string' },
        tier: {
          description: 'Service Tier of the resource sku',
          type: 'string'
        },
        size: {
          description: 'Size specifier of the resource sku',
          type: 'string'
        },
        family: {
          description: 'Family code of the resource sku',
          type: 'string'
        },
        capacity: {
          format: 'int32',
          description: 'Current number of instances assigned to the resource',
          type: 'integer'
        }
      }
    }
  }
}
```
## Misc
The resource version is `2015-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2015-08-01/service.json).
