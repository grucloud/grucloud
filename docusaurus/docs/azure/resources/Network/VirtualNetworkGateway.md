---
id: VirtualNetworkGateway
title: VirtualNetworkGateway
---
Provides a **VirtualNetworkGateway** from the **Network** group
## Examples
### UpdateVirtualNetworkGateway
```js
provider.Network.makeVirtualNetworkGateway({
  name: "myVirtualNetworkGateway",
  properties: () => ({
    properties: {
      ipConfigurations: [
        {
          properties: {
            privateIPAllocationMethod: "Dynamic",
            subnet: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet1/subnets/GatewaySubnet",
            },
            publicIPAddress: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/gwpip",
            },
          },
          name: "gwipconfig1",
        },
      ],
      gatewayType: "Vpn",
      vpnType: "RouteBased",
      enableBgp: false,
      activeActive: false,
      disableIPSecReplayProtection: false,
      enableDnsForwarding: true,
      natRules: [
        {
          name: "natRule1",
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vpngw/natRules/natRule1",
          properties: {
            type: "Static",
            mode: "EgressSnat",
            ipConfigurationId: "",
            internalMappings: [{ addressSpace: "10.10.0.0/24" }],
            externalMappings: [{ addressSpace: "50.0.0.0/24" }],
          },
        },
        {
          name: "natRule2",
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vpngw/natRules/natRule2",
          properties: {
            type: "Static",
            mode: "IngressSnat",
            ipConfigurationId: "",
            internalMappings: [{ addressSpace: "20.10.0.0/24" }],
            externalMappings: [{ addressSpace: "30.0.0.0/24" }],
          },
        },
      ],
      enableBgpRouteTranslationForNat: false,
      sku: { name: "VpnGw1", tier: "VpnGw1" },
      vpnClientConfiguration: {
        vpnClientProtocols: ["OpenVPN"],
        vpnClientRootCertificates: [],
        vpnClientRevokedCertificates: [],
        radiusServers: [
          {
            radiusServerAddress: "10.2.0.0",
            radiusServerScore: 20,
            radiusServerSecret: "radiusServerSecret",
          },
        ],
      },
      bgpSettings: {
        asn: 65515,
        bgpPeeringAddress: "10.0.1.30",
        peerWeight: 0,
      },
      customRoutes: { addressPrefixes: ["101.168.0.6/32"] },
    },
    location: "centralus",
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
    publicIpAddress: resources.Network.PublicIPAddress["myPublicIPAddress"],
    virtualHubIpConfiguration:
      resources.Network.VirtualHubIpConfiguration[
        "myVirtualHubIpConfiguration"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
- [PublicIPAddress](../Network/PublicIPAddress.md)
- [VirtualHubIpConfiguration](../Network/VirtualHubIpConfiguration.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualNetworkGateway.json).
