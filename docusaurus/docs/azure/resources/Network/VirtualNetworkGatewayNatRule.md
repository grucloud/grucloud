---
id: VirtualNetworkGatewayNatRule
title: VirtualNetworkGatewayNatRule
---
Provides a **VirtualNetworkGatewayNatRule** from the **Network** group
## Examples
### VirtualNetworkGatewayNatRulePut
```js
provider.Network.makeVirtualNetworkGatewayNatRule({
  name: "myVirtualNetworkGatewayNatRule",
  properties: () => ({
    properties: {
      type: "Static",
      mode: "EgressSnat",
      ipConfigurationId:
        "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/gateway1/ipConfigurations/default",
      internalMappings: [{ addressSpace: "10.4.0.0/24", portRange: "200-300" }],
      externalMappings: [
        { addressSpace: "192.168.21.0/24", portRange: "300-400" },
      ],
    },
  }),
  dependencies: ({}) => ({
    resourceGroup: "myResourceGroup",
    virtualHubIpConfiguration: "myVirtualHubIpConfiguration",
    virtualNetworkGateway: "myVirtualNetworkGateway",
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHubIpConfiguration](../Network/VirtualHubIpConfiguration.md)
- [VirtualNetworkGateway](../Network/VirtualNetworkGateway.md)
## Swagger Schema
```js
{
  properties: {
    properties: {
      'x-ms-client-flatten': true,
      description: 'Properties of the Virtual Network Gateway NAT rule.',
      properties: {
        provisioningState: {
          readOnly: true,
          description: 'The provisioning state of the NAT Rule resource.',
          type: 'string',
          enum: [ 'Succeeded', 'Updating', 'Deleting', 'Failed' ],
          'x-ms-enum': { name: 'ProvisioningState', modelAsString: true }
        },
        type: {
          type: 'string',
          description: 'The type of NAT rule for VPN NAT.',
          enum: [ 'Static', 'Dynamic' ],
          'x-ms-enum': { name: 'VpnNatRuleType', modelAsString: true }
        },
        mode: {
          type: 'string',
          description: 'The Source NAT direction of a VPN NAT.',
          enum: [ 'EgressSnat', 'IngressSnat' ],
          'x-ms-enum': { name: 'VpnNatRuleMode', modelAsString: true }
        },
        internalMappings: {
          type: 'array',
          items: {
            properties: {
              addressSpace: {
                type: 'string',
                description: 'Address space for Vpn NatRule mapping.'
              },
              portRange: {
                type: 'string',
                description: 'Port range for Vpn NatRule mapping.'
              }
            },
            description: 'Vpn NatRule mapping.'
          },
          description: 'The private IP address internal mapping for NAT.'
        },
        externalMappings: {
          type: 'array',
          items: {
            properties: {
              addressSpace: {
                type: 'string',
                description: 'Address space for Vpn NatRule mapping.'
              },
              portRange: {
                type: 'string',
                description: 'Port range for Vpn NatRule mapping.'
              }
            },
            description: 'Vpn NatRule mapping.'
          },
          description: 'The private IP address external mapping for NAT.'
        },
        ipConfigurationId: {
          type: 'string',
          description: 'The IP Configuration ID this NAT rule applies to.'
        }
      }
    },
    name: {
      type: 'string',
      description: 'The name of the resource that is unique within a resource group. This name can be used to access the resource.'
    },
    etag: {
      type: 'string',
      readOnly: true,
      description: 'A unique read-only string that changes whenever the resource is updated.'
    },
    type: { readOnly: true, type: 'string', description: 'Resource type.' }
  },
  allOf: [
    {
      properties: { id: { type: 'string', description: 'Resource ID.' } },
      description: 'Reference to another subresource.',
      'x-ms-azure-resource': true
    }
  ],
  description: 'VirtualNetworkGatewayNatRule Resource.'
}
```
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualNetworkGateway.json).
