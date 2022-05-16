---
id: VirtualApplianceSite
title: VirtualApplianceSite
---
Provides a **VirtualApplianceSite** from the **Network** group
## Examples
### Create Network Virtual Appliance Site
```js
exports.createResources = () => [
  {
    type: "VirtualApplianceSite",
    group: "Network",
    name: "myVirtualApplianceSite",
    properties: () => ({
      properties: {
        addressPrefix: "192.168.1.0/24",
        o365Policy: {
          breakOutCategories: { allow: true, optimize: true, default: true },
        },
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      networkVirtualAppliance: "myNetworkVirtualAppliance",
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [NetworkVirtualAppliance](../Network/NetworkVirtualAppliance.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'The properties of the Virtual Appliance Sites.',
      properties: {
        addressPrefix: {
          type: 'string',
          readOnly: false,
          description: 'Address Prefix.'
        },
        o365Policy: {
          readOnly: false,
          description: 'Office 365 Policy.',
          properties: {
            breakOutCategories: {
              readOnly: false,
              description: 'Office 365 breakout categories.',
              properties: {
                allow: {
                  type: 'boolean',
                  readOnly: false,
                  description: 'Flag to control breakout of o365 allow category.'
                },
                optimize: {
                  type: 'boolean',
                  readOnly: false,
                  description: 'Flag to control breakout of o365 optimize category.'
                },
                default: {
                  type: 'boolean',
                  readOnly: false,
                  description: 'Flag to control breakout of o365 default category.'
                }
              }
            }
          }
        },
        provisioningState: {
          description: 'The provisioning state of the resource.',
          readOnly: true,
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    name: {
      type: 'string',
      description: 'Name of the virtual appliance site.'
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    type: { type: 'string', readOnly: true, description: 'Site type.' }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'Virtual Appliance Site resource.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/networkVirtualAppliance.json).
