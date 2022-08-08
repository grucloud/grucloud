---
id: NatGateway
title: NatGateway
---
Provides a **NatGateway** from the **Network** group
## Examples
### Create nat gateway
```js
exports.createResources = () => [
  {
    type: "NatGateway",
    group: "Network",
    name: "myNatGateway",
    properties: () => ({
      location: "westus",
      sku: { name: "Standard" },
      properties: {
        publicIpAddresses: [
          {
            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/PublicIpAddress1",
          },
        ],
        publicIpPrefixes: [
          {
            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPPrefixes/PublicIpPrefix1",
          },
        ],
      },
    }),
    dependencies: ({}) => ({
      resourceGroup: "myResourceGroup",
      publicIpAddresses: ["myPublicIPAddress"],
      publicIpPrefixes: ["myPublicIPPrefix"],
    }),
  },
];

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [PublicIPAddress](../Network/PublicIPAddress.md)
- [PublicIPPrefix](../Network/PublicIPPrefix.md)
## Swagger Schema
```js
{
  properties: {
    sku: {
      description: 'The nat gateway SKU.',
      properties: {
        name: {
          type: 'string',
          description: 'Name of Nat Gateway SKU.',
          enum: [ 'Standard' ],
          'x-ms-enum': { name: 'NatGatewaySkuName', modelAsString: true }
        }
      }
    },
    properties: {
      'x-ms-client-flatten': true,
      description: 'Nat Gateway properties.',
      properties: {
        idleTimeoutInMinutes: {
          type: 'integer',
          format: 'int32',
          description: 'The idle timeout of the nat gateway.'
        },
        publicIpAddresses: {
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'An array of public ip addresses associated with the nat gateway resource.'
        },
        publicIpPrefixes: {
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'An array of public ip prefixes associated with the nat gateway resource.'
        },
        subnets: {
          readOnly: true,
          type: 'array',
          items: {
            properties: { id: { type: 'string', description: 'Resource ID.' } },
            description: 'Reference to another subresource.',
            'x-ms-azure-resource': true
          },
          description: 'An array of references to the subnets using this nat gateway resource.'
        },
        resourceGuid: {
          readOnly: true,
          type: 'string',
          description: 'The resource GUID property of the NAT gateway resource.'
        },
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the NAT gateway resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        }
      }
    },
    zones: {
      type: 'array',
      items: { type: 'string' },
      description: 'A list of availability zones denoting the zone in which Nat Gateway should be deployed.'
    },
    etag: {
      readOnly: true,
      type: 'string',
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
  description: 'Nat Gateway resource.'
}
```
## Misc
The resource version is `2022-01-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2022-01-01/natGateway.json).
