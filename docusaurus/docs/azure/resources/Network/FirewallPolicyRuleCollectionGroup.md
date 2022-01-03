---
id: FirewallPolicyRuleCollectionGroup
title: FirewallPolicyRuleCollectionGroup
---
Provides a **FirewallPolicyRuleCollectionGroup** from the **Network** group
## Examples
### Create FirewallPolicyRuleCollectionGroup
```js
provider.Network.makeFirewallPolicyRuleCollectionGroup({
  name: "myFirewallPolicyRuleCollectionGroup",
  properties: () => ({
    properties: {
      priority: 100,
      ruleCollections: [
        {
          ruleCollectionType: "FirewallPolicyFilterRuleCollection",
          name: "Example-Filter-Rule-Collection",
          priority: 100,
          action: { type: "Deny" },
          rules: [
            {
              ruleType: "NetworkRule",
              name: "network-rule1",
              sourceAddresses: ["10.1.25.0/24"],
              destinationAddresses: ["*"],
              ipProtocols: ["TCP"],
              destinationPorts: ["*"],
            },
          ],
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```

### Create FirewallPolicyRuleCollectionGroup With IpGroups
```js
provider.Network.makeFirewallPolicyRuleCollectionGroup({
  name: "myFirewallPolicyRuleCollectionGroup",
  properties: () => ({
    properties: {
      priority: 110,
      ruleCollections: [
        {
          ruleCollectionType: "FirewallPolicyFilterRuleCollection",
          name: "Example-Filter-Rule-Collection",
          action: { type: "Deny" },
          rules: [
            {
              ruleType: "NetworkRule",
              name: "network-1",
              ipProtocols: ["TCP"],
              destinationPorts: ["*"],
              sourceIpGroups: [
                "/subscriptions/subid/providers/Microsoft.Network/resourceGroup/rg1/ipGroups/ipGroups1",
              ],
              destinationIpGroups: [
                "/subscriptions/subid/providers/Microsoft.Network/resourceGroup/rg1/ipGroups/ipGroups2",
              ],
            },
          ],
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```

### Create FirewallPolicyNatRuleCollectionGroup
```js
provider.Network.makeFirewallPolicyRuleCollectionGroup({
  name: "myFirewallPolicyRuleCollectionGroup",
  properties: () => ({
    properties: {
      priority: 100,
      ruleCollections: [
        {
          ruleCollectionType: "FirewallPolicyNatRuleCollection",
          priority: 100,
          name: "Example-Nat-Rule-Collection",
          action: { type: "DNAT" },
          rules: [
            {
              ruleType: "NatRule",
              name: "nat-rule1",
              translatedFqdn: "internalhttp.server.net",
              translatedPort: "8080",
              ipProtocols: ["TCP", "UDP"],
              sourceAddresses: ["2.2.2.2"],
              sourceIpGroups: [],
              destinationAddresses: ["152.23.32.23"],
              destinationPorts: ["8080"],
            },
          ],
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```

### Create FirewallPolicyRuleCollectionGroup With Web Categories
```js
provider.Network.makeFirewallPolicyRuleCollectionGroup({
  name: "myFirewallPolicyRuleCollectionGroup",
  properties: () => ({
    properties: {
      priority: 110,
      ruleCollections: [
        {
          ruleCollectionType: "FirewallPolicyFilterRuleCollection",
          name: "Example-Filter-Rule-Collection",
          action: { type: "Deny" },
          rules: [
            {
              ruleType: "ApplicationRule",
              name: "rule1",
              description: "Deny inbound rule",
              protocols: [{ protocolType: "Https", port: 443 }],
              sourceAddresses: ["216.58.216.164", "10.0.0.0/24"],
              webCategories: ["Hacking"],
            },
          ],
        },
      ],
    },
  }),
  dependencies: ({ resources }) => ({
    resourceGroup: resources.Resources.ResourceGroup["myResourceGroup"],
    firewallPolicy: resources.Network.FirewallPolicy["myFirewallPolicy"],
  }),
});

```
## Dependencies
- [ResourceGroup](../Resources/ResourceGroup.md)
- [FirewallPolicy](../Network/FirewallPolicy.md)
## Misc
The resource version is `2021-05-01`.

The Swagger schema used to generate this documentation can be found [here](https://github.com/Azure/azure-rest-api-specs/tree/main/specification/network/resource-manager/Microsoft.Network/stable/2021-05-01/firewallPolicy.json).
