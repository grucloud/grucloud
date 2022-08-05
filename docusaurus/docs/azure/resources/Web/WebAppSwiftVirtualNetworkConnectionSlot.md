---
id: WebAppSwiftVirtualNetworkConnectionSlot
title: WebAppSwiftVirtualNetworkConnectionSlot
---
Provides a **WebAppSwiftVirtualNetworkConnectionSlot** from the **Web** group
## Examples
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
- [WebApp](../Web/WebApp.md)
- [WebAppSlot](../Web/WebAppSlot.md)
## Swagger Schema
```js
{
  description: 'Swift Virtual Network Contract. This is used to enable the new Swift way of doing virtual network integration.',
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
      description: 'SwiftVirtualNetwork resource specific properties',
      type: 'object',
      properties: {
        subnetResourceId: {
          description: "The Virtual Network subnet's resource ID. This is the subnet that this Web App will join. This subnet must have a delegation to Microsoft.Web/serverFarms defined first.",
          type: 'string'
        },
        swiftSupported: {
          description: 'A flag that specifies if the scale unit this Web App is on supports Swift integration.',
          type: 'boolean'
        }
      },
      'x-ms-client-flatten': true
    }
  }
}
```
## Misc
The resource version is `2022-03-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/web/resource-manager/Microsoft.Web/stable/2022-03-01/WebApps.json).
