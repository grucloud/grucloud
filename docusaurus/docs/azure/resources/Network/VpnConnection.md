---
id: VpnConnection
title: VpnConnection
---
Provides a **VpnConnection** from the **Network** group
## Examples
### VpnConnectionPut
```js
provider.Network.makeVpnConnection({
  name: "myVpnConnection",
  properties: () => ({
    properties: {
      remoteVpnSite: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnSites/vpnSite1",
      },
      vpnLinkConnections: [
        {
          name: "Connection-Link1",
          properties: {
            vpnSiteLink: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnSites/vpnSite1/vpnSiteLinks/siteLink1",
            },
            connectionBandwidth: 200,
            vpnConnectionProtocolType: "IKEv2",
            sharedKey: "key",
            vpnLinkConnectionMode: "Default",
            usePolicyBasedTrafficSelectors: false,
          },
        },
      ],
      trafficSelectorPolicies: [],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    vpnSite: resources.Network.VpnSite["myVpnSite"],
    routeTable: resources.Network.RouteTable["myRouteTable"],
    gateway: resources.Network.VpnGateway["myVpnGateway"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VpnSite](../Network/VpnSite.md)
- [RouteTable](../Network/RouteTable.md)
- [VpnGateway](../Network/VpnGateway.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
