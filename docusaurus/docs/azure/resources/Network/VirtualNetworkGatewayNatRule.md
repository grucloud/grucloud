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
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualHubIpConfiguration:
      resources.Network.VirtualHubIpConfiguration[
        "myVirtualHubIpConfiguration"
      ],
    virtualNetworkGateway:
      resources.Network.VirtualNetworkGateway["myVirtualNetworkGateway"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHubIpConfiguration](../Network/VirtualHubIpConfiguration.md)
- [VirtualNetworkGateway](../Network/VirtualNetworkGateway.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualNetworkGateway.json).
