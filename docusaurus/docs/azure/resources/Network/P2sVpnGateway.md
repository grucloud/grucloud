---
id: P2sVpnGateway
title: P2sVpnGateway
---
Provides a **P2sVpnGateway** from the **Network** group
## Examples
### P2SVpnGatewayPut
```js
provider.Network.makeP2sVpnGateway({
  name: "myP2sVpnGateway",
  properties: () => ({
    location: "West US",
    tags: { key1: "value1" },
    properties: {
      virtualHub: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1",
      },
      vpnServerConfiguration: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnServerConfigurations/vpnServerConfiguration1",
      },
      p2SConnectionConfigurations: [
        {
          name: "P2SConnectionConfig1",
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/p2sVpnGateways/p2sVpnGateway1/p2sConnectionConfigurations/P2SConnectionConfig1",
          properties: {
            vpnClientAddressPool: { addressPrefixes: ["101.3.0.0/16"] },
            routingConfiguration: {
              associatedRouteTable: {
                id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable1",
              },
              propagatedRouteTables: {
                labels: ["label1", "label2"],
                ids: [
                  {
                    id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable1",
                  },
                  {
                    id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable2",
                  },
                  {
                    id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1/hubRouteTables/hubRouteTable3",
                  },
                ],
              },
              vnetRoutes: { staticRoutes: [] },
            },
          },
        },
      ],
      vpnGatewayScaleUnit: 1,
      customDnsServers: ["1.1.1.1", "2.2.2.2"],
      isRoutingPreferenceInternet: false,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
    routeTable: resources.Network.RouteTable["myRouteTable"],
    vpnServerConfiguration:
      resources.Network.VpnServerConfiguration["myVpnServerConfiguration"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualHub](../Network/VirtualHub.md)
- [RouteTable](../Network/RouteTable.md)
- [VpnServerConfiguration](../Network/VpnServerConfiguration.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
