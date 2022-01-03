---
id: VirtualNetworkGatewayConnection
title: VirtualNetworkGatewayConnection
---
Provides a **VirtualNetworkGatewayConnection** from the **Network** group
## Examples
### CreateVirtualNetworkGatewayConnection_S2S
```js
provider.Network.makeVirtualNetworkGatewayConnection({
  name: "myVirtualNetworkGatewayConnection",
  properties: () => ({
    properties: {
      virtualNetworkGateway1: {
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
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vpngw/ipConfigurations/gwipconfig1",
            },
          ],
          gatewayType: "Vpn",
          vpnType: "RouteBased",
          enableBgp: false,
          activeActive: false,
          sku: { name: "VpnGw1", tier: "VpnGw1" },
          bgpSettings: {
            asn: 65514,
            bgpPeeringAddress: "10.0.1.30",
            peerWeight: 0,
          },
        },
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vpngw",
        location: "centralus",
        tags: {},
      },
      localNetworkGateway2: {
        properties: {
          localNetworkAddressSpace: { addressPrefixes: ["10.1.0.0/16"] },
          gatewayIpAddress: "x.x.x.x",
        },
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/localNetworkGateways/localgw",
        location: "centralus",
        tags: {},
      },
      ingressNatRules: [
        {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vpngw/natRules/natRule1",
        },
      ],
      egressNatRules: [
        {
          id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworkGateways/vpngw/natRules/natRule2",
        },
      ],
      connectionType: "IPsec",
      connectionProtocol: "IKEv2",
      routingWeight: 0,
      dpdTimeoutSeconds: 30,
      sharedKey: "Abc123",
      enableBgp: false,
      usePolicyBasedTrafficSelectors: false,
      ipsecPolicies: [],
      trafficSelectorPolicies: [],
      connectionMode: "Default",
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
