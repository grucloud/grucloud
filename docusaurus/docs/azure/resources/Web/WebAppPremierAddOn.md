---
id: WebAppPremierAddOn
title: WebAppPremierAddOn
---
Provides a **WebAppPremierAddOn** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [WebApp](../Web/WebApp.md)
## Swagger Schema
```js
{
  description: 'Premier add-on.',
  type: 'object',
  allOf: [
    {
      description: 'Azure resource. This resource is tracked in Azure Resource Manager',
      required: [ 'location' ],
      type: 'object',
      properties: {
        id: { description: 'Resource Id.', type: 'string', readOnly: true },
        name: {
          description: 'Resource Name.',
          type: 'string',
          readOnly: true
        },
        kind: { description: 'Kind of resource.', type: 'string' },
        location: { description: 'Resource Location.', type: 'string' },
        type: {
          description: 'Resource type.',
          type: 'string',
          readOnly: true
        },
        tags: {
          description: 'Resource tags.',
          type: 'object',
          additionalProperties: { type: 'string' }
        }
      },
      'x-ms-azure-resource': true
    }
  ],
  properties: {
    properties: {
      description: 'PremierAddOn resource specific properties',
      type: 'object',
      properties: {
        sku: { description: 'Premier add on SKU.', type: 'string' },
        product: { description: 'Premier add on Product.', type: 'string' },
        vendor: { description: 'Premier add on Vendor.', type: 'string' },
        marketplacePublisher: {
          description: 'Premier add on Marketplace publisher.',
          type: 'string'
        },
        marketplaceOffer: {
          description: 'Premier add on Marketplace offer.',
          type: 'string'
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2021-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2021-03-01/WebApps.json).
