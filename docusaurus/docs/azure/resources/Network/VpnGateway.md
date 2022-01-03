---
id: VpnGateway
title: VpnGateway
---
Provides a **VpnGateway** from the **Network** group
## Examples
### VpnGatewayPut
```js
provider.Network.makeVpnGateway({
  name: "myVpnGateway",
  properties: () => ({
    location: "westcentralus",
    tags: { key1: "value1" },
    properties: {
      virtualHub: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/virtualHub1",
      },
      connections: [
        {
          name: "vpnConnection1",
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
                  egressNatRules: [
                    {
                      id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/vpnGateways/gateway1/natRules/nat03",
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
      bgpSettings: {
        asn: 65515,
        peerWeight: 0,
        bgpPeeringAddresses: [
          {
            ipconfigurationId: "Instance0",
            customBgpIpAddresses: ["169.254.21.5"],
          },
          {
            ipconfigurationId: "Instance1",
            customBgpIpAddresses: ["169.254.21.10"],
          },
        ],
      },
      natRules: [
        {
          name: "nat03",
          properties: {
            type: "Static",
            mode: "EgressSnat",
            internalMappings: [{ addressSpace: "0.0.0.0/26" }],
            externalMappings: [{ addressSpace: "192.168.0.0/26" }],
            ipConfigurationId: "",
          },
        },
      ],
      isRoutingPreferenceInternet: false,
      enableBgpRouteTranslationForNat: false,
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
