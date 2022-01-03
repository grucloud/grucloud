---
id: VpnSite
title: VpnSite
---
Provides a **VpnSite** from the **Network** group
## Examples
### VpnSiteCreate
```js
provider.Network.makeVpnSite({
  name: "myVpnSite",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    properties: {
      virtualWan: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualWANs/wan1",
      },
      addressSpace: { addressPrefixes: ["10.0.0.0/16"] },
      isSecuritySite: false,
      vpnSiteLinks: [
        {
          name: "vpnSiteLink1",
          properties: {
            ipAddress: "50.50.50.56",
            fqdn: "link1.vpnsite1.contoso.com",
            linkProperties: { linkProviderName: "vendor1", linkSpeedInMbps: 0 },
            bgpProperties: { bgpPeeringAddress: "192.168.0.0", asn: 1234 },
          },
        },
      ],
      o365Policy: {
        breakOutCategories: { allow: true, optimize: true, default: false },
      },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    virtualWan: resources.Network.VirtualWan["myVirtualWan"],
    virtualHubIpConfiguration:
      resources.Network.VirtualHubIpConfiguration[
        "myVirtualHubIpConfiguration"
      ],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [VirtualWan](../Network/VirtualWan.md)
- [VirtualHubIpConfiguration](../Network/VirtualHubIpConfiguration.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/virtualWan.json).
