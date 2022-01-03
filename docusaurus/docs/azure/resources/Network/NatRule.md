---
id: NatRule
title: NatRule
---
Provides a **NatRule** from the **Network** group
## Examples
### NatRulePut
```js
provider.Network.makeNatRule({
  name: "myNatRule",
  properties: () => ({
    properties: {
      type: "Static",
      mode: "EgressSnat",
      ipConfigurationId:
        "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/cloudnet1-VNG/ipConfigurations/default",
      internalMappings: [{ addressSpace: "10.4.0.0/24" }],
      externalMappings: [{ addressSpace: "192.168.21.0/24" }],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    gateway: resources.Network.VpnGateway["myVpnGateway"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VpnGateway](../Network/VpnGateway.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
