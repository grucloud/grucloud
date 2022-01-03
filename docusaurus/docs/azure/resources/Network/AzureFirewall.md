---
id: AzureFirewall
title: AzureFirewall
---
Provides a **AzureFirewall** from the **Network** group
## Examples
### Create Azure Firewall
```js
provider.Network.makeAzureFirewall({
  name: "myAzureFirewall",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    zones: [],
    properties: {
      sku: { name: "AZFW_VNet", tier: "Standard" },
      threatIntelMode: "Alert",
      ipConfigurations: [
        {
          name: "azureFirewallIpConfiguration",
          properties: {
            subnet: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallSubnet",
            },
            publicIPAddress: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pipName",
            },
          },
        },
      ],
      applicationRuleCollections: [
        {
          name: "apprulecoll",
          properties: {
            priority: 110,
            action: { type: "Deny" },
            rules: [
              {
                name: "rule1",
                description: "Deny inbound rule",
                protocols: [{ protocolType: "Https", port: 443 }],
                targetFqdns: ["www.test.com"],
                sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
              },
            ],
          },
        },
      ],
      natRuleCollections: [
        {
          name: "natrulecoll",
          properties: {
            priority: 112,
            action: { type: "Dnat" },
            rules: [
              {
                name: "DNAT-HTTPS-traffic",
                description: "D-NAT all outbound web traffic for inspection",
                sourceAddresses: ["*"],
                destinationAddresses: ["1.2.3.4"],
                destinationPorts: ["443"],
                protocols: ["TCP"],
                translatedAddress: "1.2.3.5",
                translatedPort: "8443",
              },
              {
                name: "DNAT-HTTP-traffic-With-FQDN",
                description: "D-NAT all inbound web traffic for inspection",
                sourceAddresses: ["*"],
                destinationAddresses: ["1.2.3.4"],
                destinationPorts: ["80"],
                protocols: ["TCP"],
                translatedFqdn: "internalhttpserver",
                translatedPort: "880",
              },
            ],
          },
        },
      ],
      networkRuleCollections: [
        {
          name: "netrulecoll",
          properties: {
            priority: 112,
            action: { type: "Deny" },
            rules: [
              {
                name: "L4-traffic",
                description: "Block traffic based on source IPs and ports",
                sourceAddresses: [
                  "192.168.1.1-192.168.1.12",
                  "10.1.4.12-10.1.4.255",
                ],
                destinationPorts: ["443-444", "8443"],
                destinationAddresses: ["*"],
                protocols: ["TCP"],
              },
              {
                name: "L4-traffic-with-FQDN",
                description:
                  "Block traffic based on source IPs and ports to amazon",
                sourceAddresses: ["10.2.4.12-10.2.4.255"],
                destinationPorts: ["443-444", "8443"],
                destinationFqdns: ["www.amazon.com"],
                protocols: ["TCP"],
              },
            ],
          },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
    publicIpAddress: resources.Network.PublicIPAddress["myPublicIPAddress"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```

### Create Azure Firewall With Zones
```js
provider.Network.makeAzureFirewall({
  name: "myAzureFirewall",
  properties: () => ({
    location: "West US 2",
    tags: { key1: "value1" },
    zones: ["1", "2", "3"],
    properties: {
      threatIntelMode: "Alert",
      sku: { name: "AZFW_VNet", tier: "Standard" },
      ipConfigurations: [
        {
          name: "azureFirewallIpConfiguration",
          properties: {
            subnet: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallSubnet",
            },
            publicIPAddress: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pipName",
            },
          },
        },
      ],
      applicationRuleCollections: [
        {
          name: "apprulecoll",
          properties: {
            priority: 110,
            action: { type: "Deny" },
            rules: [
              {
                name: "rule1",
                description: "Deny inbound rule",
                protocols: [{ protocolType: "Https", port: 443 }],
                targetFqdns: ["www.test.com"],
                sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
              },
            ],
          },
        },
      ],
      natRuleCollections: [
        {
          name: "natrulecoll",
          properties: {
            priority: 112,
            action: { type: "Dnat" },
            rules: [
              {
                name: "DNAT-HTTPS-traffic",
                description: "D-NAT all outbound web traffic for inspection",
                sourceAddresses: ["*"],
                destinationAddresses: ["1.2.3.4"],
                destinationPorts: ["443"],
                protocols: ["TCP"],
                translatedAddress: "1.2.3.5",
                translatedPort: "8443",
              },
              {
                name: "DNAT-HTTP-traffic-With-FQDN",
                description: "D-NAT all inbound web traffic for inspection",
                sourceAddresses: ["*"],
                destinationAddresses: ["1.2.3.4"],
                destinationPorts: ["80"],
                protocols: ["TCP"],
                translatedFqdn: "internalhttpserver",
                translatedPort: "880",
              },
            ],
          },
        },
      ],
      networkRuleCollections: [
        {
          name: "netrulecoll",
          properties: {
            priority: 112,
            action: { type: "Deny" },
            rules: [
              {
                name: "L4-traffic",
                description: "Block traffic based on source IPs and ports",
                sourceAddresses: [
                  "192.168.1.1-192.168.1.12",
                  "10.1.4.12-10.1.4.255",
                ],
                destinationPorts: ["443-444", "8443"],
                destinationAddresses: ["*"],
                protocols: ["TCP"],
              },
              {
                name: "L4-traffic-with-FQDN",
                description:
                  "Block traffic based on source IPs and ports to amazon",
                sourceAddresses: ["10.2.4.12-10.2.4.255"],
                destinationPorts: ["443-444", "8443"],
                destinationFqdns: ["www.amazon.com"],
                protocols: ["TCP"],
              },
            ],
          },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
    publicIpAddress: resources.Network.PublicIPAddress["myPublicIPAddress"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```

### Create Azure Firewall With management subnet
```js
provider.Network.makeAzureFirewall({
  name: "myAzureFirewall",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    zones: [],
    properties: {
      sku: { name: "AZFW_VNet", tier: "Standard" },
      threatIntelMode: "Alert",
      ipConfigurations: [
        {
          name: "azureFirewallIpConfiguration",
          properties: {
            subnet: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallSubnet",
            },
            publicIPAddress: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pipName",
            },
          },
        },
      ],
      managementIpConfiguration: {
        name: "azureFirewallMgmtIpConfiguration",
        properties: {
          subnet: {
            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallManagementSubnet",
          },
          publicIPAddress: {
            id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/managementPipName",
          },
        },
      },
      applicationRuleCollections: [
        {
          name: "apprulecoll",
          properties: {
            priority: 110,
            action: { type: "Deny" },
            rules: [
              {
                name: "rule1",
                description: "Deny inbound rule",
                protocols: [{ protocolType: "Https", port: 443 }],
                targetFqdns: ["www.test.com"],
                sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
              },
            ],
          },
        },
      ],
      natRuleCollections: [
        {
          name: "natrulecoll",
          properties: {
            priority: 112,
            action: { type: "Dnat" },
            rules: [
              {
                name: "DNAT-HTTPS-traffic",
                description: "D-NAT all outbound web traffic for inspection",
                sourceAddresses: ["*"],
                destinationAddresses: ["1.2.3.4"],
                destinationPorts: ["443"],
                protocols: ["TCP"],
                translatedAddress: "1.2.3.5",
                translatedPort: "8443",
              },
              {
                name: "DNAT-HTTP-traffic-With-FQDN",
                description: "D-NAT all inbound web traffic for inspection",
                sourceAddresses: ["*"],
                destinationAddresses: ["1.2.3.4"],
                destinationPorts: ["80"],
                protocols: ["TCP"],
                translatedFqdn: "internalhttpserver",
                translatedPort: "880",
              },
            ],
          },
        },
      ],
      networkRuleCollections: [
        {
          name: "netrulecoll",
          properties: {
            priority: 112,
            action: { type: "Deny" },
            rules: [
              {
                name: "L4-traffic",
                description: "Block traffic based on source IPs and ports",
                sourceAddresses: [
                  "192.168.1.1-192.168.1.12",
                  "10.1.4.12-10.1.4.255",
                ],
                destinationPorts: ["443-444", "8443"],
                destinationAddresses: ["*"],
                protocols: ["TCP"],
              },
              {
                name: "L4-traffic-with-FQDN",
                description:
                  "Block traffic based on source IPs and ports to amazon",
                sourceAddresses: ["10.2.4.12-10.2.4.255"],
                destinationPorts: ["443-444", "8443"],
                destinationFqdns: ["www.amazon.com"],
                protocols: ["TCP"],
              },
            ],
          },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
    publicIpAddress: resources.Network.PublicIPAddress["myPublicIPAddress"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```

### Create Azure Firewall in virtual Hub
```js
provider.Network.makeAzureFirewall({
  name: "myAzureFirewall",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    zones: [],
    properties: {
      sku: { name: "AZFW_Hub", tier: "Standard" },
      threatIntelMode: "Alert",
      virtualHub: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualHubs/hub1",
      },
      firewallPolicy: {
        id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/firewallPolicies/policy1",
      },
      hubIPAddresses: { publicIPs: { addresses: [], count: 1 } },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
    publicIpAddress: resources.Network.PublicIPAddress["myPublicIPAddress"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```

### Create Azure Firewall With Additional Properties
```js
provider.Network.makeAzureFirewall({
  name: "myAzureFirewall",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    zones: [],
    properties: {
      sku: { name: "AZFW_VNet", tier: "Standard" },
      threatIntelMode: "Alert",
      ipConfigurations: [
        {
          name: "azureFirewallIpConfiguration",
          properties: {
            subnet: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallSubnet",
            },
            publicIPAddress: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pipName",
            },
          },
        },
      ],
      applicationRuleCollections: [
        {
          name: "apprulecoll",
          properties: {
            priority: 110,
            action: { type: "Deny" },
            rules: [
              {
                name: "rule1",
                description: "Deny inbound rule",
                protocols: [{ protocolType: "Https", port: 443 }],
                targetFqdns: ["www.test.com"],
                sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
              },
            ],
          },
        },
      ],
      natRuleCollections: [
        {
          name: "natrulecoll",
          properties: {
            priority: 112,
            action: { type: "Dnat" },
            rules: [
              {
                name: "DNAT-HTTPS-traffic",
                description: "D-NAT all outbound web traffic for inspection",
                sourceAddresses: ["*"],
                destinationAddresses: ["1.2.3.4"],
                destinationPorts: ["443"],
                protocols: ["TCP"],
                translatedAddress: "1.2.3.5",
                translatedPort: "8443",
              },
              {
                name: "DNAT-HTTP-traffic-With-FQDN",
                description: "D-NAT all inbound web traffic for inspection",
                sourceAddresses: ["*"],
                destinationAddresses: ["1.2.3.4"],
                destinationPorts: ["80"],
                protocols: ["TCP"],
                translatedFqdn: "internalhttpserver",
                translatedPort: "880",
              },
            ],
          },
        },
      ],
      networkRuleCollections: [
        {
          name: "netrulecoll",
          properties: {
            priority: 112,
            action: { type: "Deny" },
            rules: [
              {
                name: "L4-traffic",
                description: "Block traffic based on source IPs and ports",
                sourceAddresses: [
                  "192.168.1.1-192.168.1.12",
                  "10.1.4.12-10.1.4.255",
                ],
                destinationPorts: ["443-444", "8443"],
                destinationAddresses: ["*"],
                protocols: ["TCP"],
              },
              {
                name: "L4-traffic-with-FQDN",
                description:
                  "Block traffic based on source IPs and ports to amazon",
                sourceAddresses: ["10.2.4.12-10.2.4.255"],
                destinationPorts: ["443-444", "8443"],
                destinationFqdns: ["www.amazon.com"],
                protocols: ["TCP"],
              },
            ],
          },
        },
      ],
      ipGroups: [],
      additionalProperties: { key1: "value1", key2: "value2" },
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
    publicIpAddress: resources.Network.PublicIPAddress["myPublicIPAddress"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```

### Create Azure Firewall With IpGroups
```js
provider.Network.makeAzureFirewall({
  name: "myAzureFirewall",
  properties: () => ({
    tags: { key1: "value1" },
    location: "West US",
    zones: [],
    properties: {
      sku: { name: "AZFW_VNet", tier: "Standard" },
      threatIntelMode: "Alert",
      ipConfigurations: [
        {
          name: "azureFirewallIpConfiguration",
          properties: {
            subnet: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/virtualNetworks/vnet2/subnets/AzureFirewallSubnet",
            },
            publicIPAddress: {
              id: "/subscriptions/subid/resourceGroups/rg1/providers/Microsoft.Network/publicIPAddresses/pipName",
            },
          },
        },
      ],
      applicationRuleCollections: [
        {
          name: "apprulecoll",
          properties: {
            priority: 110,
            action: { type: "Deny" },
            rules: [
              {
                name: "rule1",
                description: "Deny inbound rule",
                protocols: [{ protocolType: "Https", port: 443 }],
                targetFqdns: ["www.test.com"],
                sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
              },
            ],
          },
        },
      ],
      natRuleCollections: [
        {
          name: "natrulecoll",
          properties: {
            priority: 112,
            action: { type: "Dnat" },
            rules: [
              {
                name: "DNAT-HTTPS-traffic",
                description: "D-NAT all outbound web traffic for inspection",
                sourceAddresses: ["*"],
                destinationAddresses: ["1.2.3.4"],
                destinationPorts: ["443"],
                protocols: ["TCP"],
                translatedAddress: "1.2.3.5",
                translatedPort: "8443",
              },
              {
                name: "DNAT-HTTP-traffic-With-FQDN",
                description: "D-NAT all inbound web traffic for inspection",
                sourceAddresses: ["*"],
                destinationAddresses: ["1.2.3.4"],
                destinationPorts: ["80"],
                protocols: ["TCP"],
                translatedFqdn: "internalhttpserver",
                translatedPort: "880",
              },
            ],
          },
        },
      ],
      networkRuleCollections: [
        {
          name: "netrulecoll",
          properties: {
            priority: 112,
            action: { type: "Deny" },
            rules: [
              {
                name: "L4-traffic",
                description: "Block traffic based on source IPs and ports",
                sourceAddresses: [
                  "192.168.1.1-192.168.1.12",
                  "10.1.4.12-10.1.4.255",
                ],
                destinationPorts: ["443-444", "8443"],
                destinationAddresses: ["*"],
                protocols: ["TCP"],
              },
              {
                name: "L4-traffic-with-FQDN",
                description:
                  "Block traffic based on source IPs and ports to amazon",
                sourceAddresses: ["10.2.4.12-10.2.4.255"],
                destinationPorts: ["443-444", "8443"],
                destinationFqdns: ["www.amazon.com"],
                protocols: ["TCP"],
              },
            ],
          },
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    subnet: resources.Network.Subnet["mySubnet"],
    publicIpAddress: resources.Network.PublicIPAddress["myPublicIPAddress"],
    virtualHub: resources.Network.VirtualHub["myVirtualHub"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [Subnet](../Network/Subnet.md)
- [PublicIPAddress](../Network/PublicIPAddress.md)
- [VirtualHub](../Network/VirtualHub.md)
- [FirewallPolicy](../Network/FirewallPolicy.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/azureFirewall.json).
