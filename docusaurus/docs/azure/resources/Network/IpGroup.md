---
id: IpGroup
title: IpGroup
---
Provides a **IpGroup** from the **Network** group
## Examples
### CreateOrUpdate_IpGroups
```js
exports.createResources = () => [
  {
    type: "IpGroup",
    group: "Network",
    name: "myIpGroup",
    properties: () => ({
      tags: { key1: "value1" },
      location: "West US",
      properties: {
        ipAddresses: ["13.64.39.16/32", "40.74.146.80/31", "40.74.147.32/28"],
      },
    }),
    dependencies: ({}) => ({ resourceGroup: "myResourceGroup" }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the IpGroups.',
      properties: {
        provisioningState: {
          description: 'The provisioning state of the IpGroups resource.',
          readOnly: true,
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        ipAddresses: {
          type: 'array',
          items: { type: 'string' },
          description: 'IpAddresses/IpAddressPrefixes in the IpGroups resource.'
        },
        firewalls: {
          type: 'array',
          readOnly: true,
          description: 'List of references to Firewall resources that this IpGroups is associated with.',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          }
        },
        firewallPolicies: {
          type: 'array',
          readOnly: true,
          description: 'List of references to Firewall Policies resources that this IpGroups is associated with.',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          }
        }
      }
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    }
  },
  allOf: [
    {
      properties: {
        id: { type: 'string', description: 'Resource ID.' },
        name: {
          readOnly: true,
          type: 'string',
          description: 'Resource name.'
        },
        type: {
          readOnly: true,
          type: 'string',
          description: 'Resource type.'
        },
        location: { type: 'string', description: 'Resource location.' },
        tags: {
          type: 'object',
          additionalProperties: { type: 'string' },
          description: 'Resource tags.'
        }
      },
      description: 'Common resource representation.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'The IpGroups resource information.'
}
```
## Misc
The resource version is `2021-08-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-08-01/ipGroups.json).
